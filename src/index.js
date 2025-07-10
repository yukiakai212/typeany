#!/usr/bin/env node

import inquirer from 'inquirer';
import { existsSync } from 'fs';
import path from 'path';
import chalk from 'chalk';

console.log(chalk.cyan.bold('\n🌿 Welcome to typeany – The End of Types\n'));

const questions = [
  {
    type: 'input',
    name: 'projectPath',
    message: '📁 Path to your TypeScript project:',
    default: '.',
    validate: (input) => existsSync(path.resolve(input)) || '❌ Path does not exist!',
  },
  {
    type: 'confirm',
    name: 'believeIllusion',
    message: '❓ Do you believe types are just illusions?',
    default: true,
  },
  {
    type: 'confirm',
    name: 'tiredOfTypes',
    message: '❓ Are you tired of fixing types instead of fixing bugs?',
    default: true,
  },
  {
    type: 'list',
    name: 'conversionDepth',
    message: '🌀 How deep should we convert types to `any`?',
    choices: ['Just top-level files', 'All source files', 'Everything, even node_modules 🔥'],
    default: 'All source files',
  },
  {
    type: 'confirm',
    name: 'confirmMadness',
    message: '☠️ This action is irreversible. Are you sure?',
    default: false,
  },
];

const run = async () => {
  const answers = await inquirer.prompt(questions);

  if (!answers.confirmMadness) {
    console.log(chalk.yellow('\n💡 Probably a good choice. Some sanity remains.\n'));
    process.exit(0);
  }

  console.log(chalk.green('\n🔧 Converting your beautiful types into spiritual `any`...\n'));

  // 🧙‍♂️ Here's the troll part – we fake processing
  await new Promise((r) => setTimeout(r, 1500));

  console.log(chalk.gray('⌛ Removing interfaces...'));
  await new Promise((r) => setTimeout(r, 800));

  console.log(chalk.gray('⌛ Replacing type aliases with `any`...'));
  await new Promise((r) => setTimeout(r, 800));

  console.log(chalk.gray('⌛ Adding // @ts-ignore everywhere...'));
  await new Promise((r) => setTimeout(r, 800));

  console.log(chalk.bold.green('\n✨ Done! Your project is now type-free and spiritually clean.'));

  console.log(
    chalk.italic.magentaBright(
      '\n🍃 Bro, if you’re feeling down because your code has too many bugs... go touch some grass for a bit, alright? \nKeep this up and you might actually lose your job..\n',
    ),
  );
};

run();
