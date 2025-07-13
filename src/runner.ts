import fs from 'node:fs';
import path from 'node:path';
import { Project, SyntaxKind, ts, AsExpression, Node } from 'ts-morph';
import glob from 'fast-glob';
import { TypegoneConfig } from './types.js';
import { logger } from './logger.js';

export async function runTypegone(config: TypegoneConfig) {
  for (const key of Object.keys(config)) {
    logger.debug(`Config with ${key}: ${config[key]}`);
  }
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
    logger.info(`Compile: ${filePath} `);

    // Replace all explicit type annotations with "any"
    sourceFile.forEachDescendant((node) => {
      const typeNodesToReplace: Node[] = [];
      const indexSigToReplace: Node[] = [];
      const asExpressionsToFix: AsExpression[] = [];
      //const typeParamsToRemove: Node[] = [];

      if (node.getKind() === SyntaxKind.IndexSignature) {
        indexSigToReplace.push(node);
      } else if (ts.isTypeNode(node.compilerNode) && node.getKind() !== SyntaxKind.AnyKeyword) {
        const parent = node.getParent();
        const grandParent = parent.getParent();
        if (grandParent?.getKind() === SyntaxKind.IndexSignature) {
          logger.debug(`🔥 Skipped parameter inside IndexSignature: ${parent.getText()}`);
          return;
        }

        if (parent && 'setType' in parent) {
          typeNodesToReplace.push(parent);
        }
      }

      // Replace 'as Something' with 'as any'
      if (node.getKind() === SyntaxKind.AsExpression) {
        const asExpr = node.asKind(SyntaxKind.AsExpression)!;

        asExpressionsToFix.push(asExpr);
      }

      // Remove generic type params
      if (node.getKind() === SyntaxKind.TypeParameter) {
        const typeParamNode = node.asKind(SyntaxKind.TypeParameter)!;
        logger.debug(`Changed ${typeParamNode.getText()} to any`);
        typeParamNode.remove();
      }
      for (const sig of indexSigToReplace) {
        const indexSig = sig.asKind(SyntaxKind.IndexSignature);
        if (config.stripTypes) {
          logger.debug(`Stripped type from index signature: ${indexSig.getText()}`);
          indexSig.removeReturnType();
          const param = node.getFirstChildByKind(SyntaxKind.Parameter);
          if (!param?.getName()) continue;
          sig.replaceWithText(param.getName());
        } else {
          logger.debug(`Changed index signature return type to any: ${indexSig.getText()}`);
          indexSig.setReturnType('string');
        }
      }
      for (const parent of typeNodesToReplace) {
        if (config.stripTypes) {
          logger.debug(`Stripped type from: ${parent.getText()}`);

          if ('removeType' in parent && typeof parent.removeType === 'function') {
            parent.removeType();
          } else {
            parent.setType('');
          }
        } else {
          logger.debug(`Changed ${parent.getText()} to any`);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (parent as any).setType('any');
        }
      }
      for (const asExpr of asExpressionsToFix) {
        if (config.stripTypes) {
          logger.debug(`Stripped as-expression: ${asExpr.getText()}`);
          const exprText = asExpr.getExpression().getText();
          asExpr.replaceWithText(exprText);
        } else {
          logger.debug(`Changed ${asExpr.getText()} to any`);
          asExpr.getTypeNode()?.replaceWithText('any');
        }
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
        if (config.stripTypes) {
          node.removeReturnType();
        } else if (returnTypeNode && returnTypeNode.getText() !== 'any') {
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
        if (config.stripTypes) {
          logger.debug(`Removed type annotation from variable: ${node.getName()}`);
          node.removeType();
        } else if (typeNode) {
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
        //if (param.getNameNode().getKind() === SyntaxKind.ObjectBindingPattern) return;

        const typeNode = param.getTypeNode();
        if (config.stripTypes) {
          logger.debug(`Removed type annotation from parameter variable: ${node.getName()}`);
          node.removeType();
        } else if (typeNode && typeNode.getText() !== 'any') {
          logger.debug(`Param ${param.getName()} type changed to any`);
          typeNode.replaceWithText('any');
        } else if (!typeNode) {
          logger.debug(`Param ${param.getName()} type added as any`);
          param.setType('any');
        }
      }
    });

    // Replace interface members with any
    sourceFile.getInterfaces().forEach((iface) => {
      iface.getMembers().forEach((member) => {
        if (Node.isPropertySignature(member)) {
          const typeNode = member.getTypeNode();

          if (config.stripTypes) {
            if (typeNode) {
              member.removeType(); // remove : type
            }
          } else {
            if (typeNode) {
              typeNode.replaceWithText('any');
            } else {
              member.setType('any'); // set if not have type
            }
          }
        }
      });
    });

    // Replace type aliases with 'any'
    sourceFile.getTypeAliases().forEach((alias) => {
      if (config.stripTypes) {
        logger.debug(`Removed type alias: ${alias.getName()}`);
        alias.remove(); //....
      } else {
        alias.setType('any');
      }
    });

    // Process JSDoc types
    if (config.convertJsDoc || config.removeJsDocType) {
      const replacements: { pos: number; end: number; updated: string }[] = [];
      sourceFile.getStatementsWithComments().forEach((stmt) => {
        const leading = stmt.getLeadingCommentRanges();
        leading.forEach((range) => {
          const comment = range.getText();

          if (config.removeJsDocType) {
            // Delete comment @param, @return, @type
            const isTypeDoc = /@param|@returns?|@type/.test(comment);
            if (isTypeDoc) {
              replacements.push({
                pos: range.getPos(),
                end: range.getPos() + range.getWidth(),
                updated: '', // xóa trắng
              });
            }
          } else if (config.convertJsDoc) {
            // Change {Type} → {any}
            const updated = comment.replace(/\{[^}]+\}/g, '{any}');
            if (comment !== updated) {
              replacements.push({
                pos: range.getPos(),
                end: range.getPos() + range.getWidth(),
                updated,
              });
            }
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
