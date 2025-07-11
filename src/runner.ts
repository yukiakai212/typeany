import fs from 'node:fs';
import path from 'node:path';
import { Project, SyntaxKind, ts } from 'ts-morph';
import glob from 'fast-glob';
import { TypegoneConfig } from './types.js';
import { logger } from './logger.js';

export async function runTypegone(config: TypegoneConfig) {
  const project = new Project({ useInMemoryFileSystem: false });

  const files = await glob(config.include ?? ['src/**/*.{ts,tsx}'], {
    ignore: config.exclude ?? ['**/node_modules/**', '**/dist/**'],
    absolute: true,
  });

  if (files.length === 0) {
    logger.warn('No files matched your config.include pattern.');
    return;
  }

  for (const filePath of files) {
    const sourceFile = project.addSourceFileAtPath(filePath);

    // Replace all explicit type annotations with "any"
    sourceFile.forEachDescendant((node) => {
      const typeNodesToReplace: Node[] = [];
      const asExpressionsToFix: AsExpression[] = [];
      //const typeParamsToRemove: Node[] = [];

      if (ts.isTypeNode(node.compilerNode) && node.getKind() !== SyntaxKind.AnyKeyword) {
        const parent = node.getParent();
        if (parent && 'setType' in parent) {
          typeNodesToReplace.push(parent);
        }
      }

      // Replace 'as Something' with 'as any'
      if (node.getKind() === SyntaxKind.AsExpression) {
        const asExpr = node.asKind(SyntaxKind.AsExpression)!;

        asExpressionsToFix.push(asExpr);
      }

      // Remove generic type params (if aggressive)
      if (config.aggressive && node.getKind() === SyntaxKind.TypeParameter) {
        node.remove();
      }
      for (const parent of typeNodesToReplace) {
        logger.debug(`Changed ${parent.getText()} to any`);
        parent.setType('any');
      }
      for (const asExpr of asExpressionsToFix) {
        logger.debug(`Changed ${asExpr.getText()} to any`);
        asExpr.getTypeNode()?.replaceWithText('any');
      }
    });

    // Replace return type
    sourceFile.forEachDescendant((node) => {
      if (
        node.getKind() === SyntaxKind.FunctionDeclaration ||
        node.getKind() === SyntaxKind.FunctionExpression ||
        node.getKind() === SyntaxKind.ArrowFunction ||
        node.getKind() === SyntaxKind.MethodDeclaration
      ) {
        const fn = node.asKindOrThrow(
          node.getKind() as
            | SyntaxKind.FunctionDeclaration
            | SyntaxKind.FunctionExpression
            | SyntaxKind.ArrowFunction
            | SyntaxKind.MethodDeclaration,
        );

        const returnTypeNode = fn.getReturnTypeNode();
        if (returnTypeNode && returnTypeNode.getText() !== 'any') {
          logger.debug(`Change return type: ${returnTypeNode.getText()} → any`);
          returnTypeNode.replaceWithText('any');
        } else {
          fn.setReturnType('any');
        }
      }
    });

    // add any to every value
    sourceFile.forEachDescendant((node) => {
      if (node.getKind() === SyntaxKind.VariableDeclaration) {
        const varDecl = node.asKindOrThrow(SyntaxKind.VariableDeclaration);

        const typeNode = varDecl.getTypeNode();

        if (typeNode) {
          if (typeNode.getText() !== 'any') {
            logger.debug(`Changed var type ${varDecl.getName()} to any:`);
            typeNode.replaceWithText('any');
          }
        } else {
          logger.debug(`Added any to var: ${varDecl.getName()}`);
          varDecl.setType('any');
        }
      }
    });

    // add any to every params
    sourceFile.forEachDescendant((node) => {
      if (node.getKind() === SyntaxKind.Parameter) {
        const param = node.asKindOrThrow(SyntaxKind.Parameter);

        // Skip parameter destructuring like function fn({x, y})
        if (param.getNameNode().getKind() === SyntaxKind.ObjectBindingPattern) return;

        const typeNode = param.getTypeNode();

        if (typeNode && typeNode.getText() !== 'any') {
          logger.debug(`Param ${param.getName()} type changed to any`);
          typeNode.replaceWithText('any');
        } else if (!typeNode) {
          logger.debug(`Param ${param.getName()} type added as any`);
          param.setType('any');
        }
      }
    });

    // Replace interface members with [key: string]: any
    sourceFile.getInterfaces().forEach((iface) => {
      iface.getMembers().forEach((m) => m.remove());
      iface.addIndexSignature({
        keyName: 'key',
        keyType: 'string',
        returnType: 'any',
      });
    });

    // Replace type aliases with 'any'
    sourceFile.getTypeAliases().forEach((alias) => {
      alias.setType('any');
    });

    // Process JSDoc types
    if (config.convertJsDoc || config.removeJsDocType) {
      const regex = /\{[^}]+\}/g;
      const replacement = config.removeJsDocType ? '' : '{any}';
      const replacements: { pos: number; end: number; updated: string }[] = [];
      sourceFile.getStatementsWithComments().forEach((stmt) => {
        const leading = stmt.getLeadingCommentRanges();
        leading.forEach((range) => {
          const comment = range.getText();
          const updated = comment.replace(regex, replacement);

          if (comment !== updated) {
            replacements.push({
              pos: range.getPos(),
              end: range.getPos() + range.getWidth(),
              updated,
            });
          }
        });
      });
      for (const { pos, end, updated } of replacements) {
        sourceFile.replaceText([pos, end], updated);
      }
    }

    if (config.overwrite === true) {
      await sourceFile.save();
      logger.info(`Modified: ${filePath}`);
    } else {
      const relativePath = path.relative(config.rootDir, filePath);
      const outputPath = path.join(config.outDir, relativePath);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, sourceFile.getFullText(), 'utf-8');

      logger.info(`Saved modify: ${outputPath}`);
    }
  }

  logger.info('typegone complete.');
}
