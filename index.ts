#!/usr/bin/env node

import { addGroupAction, addLinkAction, queryLinkAction, removeGroupAction, removeLinkAction, showGroupAction, showLinkAction } from './cli';
import { Command } from 'commander';

const program = new Command();

program
  .name('dev-links')
  .description('CLI tool for devs to share links.')
  .version('0.1.0');

program.command("add-group")
  .description("Creates a new link group in the buffer. Requires a unique group name.")
  .argument('<string>', "Unique Group name")
  .action(addGroupAction)

program.command("remove-group")
  .description('Deletes an entire link group and all associated links from the buffer.')
  .argument('<string>', 'Unique Group name')
  .action(removeGroupAction)

program.command('show-groups')
  .description('Lists all available link groups stored in the buffer, along with their link counts')
  .action(showGroupAction)

program.command('add-link')
  .description('Adds a new link to a specified group. Requires the group name, a unique link identifier (key), and the URL.')
  .argument('<string>', 'Unique Group Name')
  .argument('<string>', 'Unique Label')
  .argument('<string>', 'URL')
  .action(addLinkAction)

program.command('remove-link')
  .description('Removes a specific link from a specified group. Requires the group name and the link identifier.')
  .argument('<string>', 'Unique Group name')
  .argument('<string>', 'Unique Label')
  .action(removeLinkAction)

program.command('show-links')
  .description('Displays all links within a specific group. Shows the link identifier and the corresponding URL.')
  .argument('<string>', 'Unique Group name')
  .action(showLinkAction)

program.command('get-link')
  .description('Retrieves a url with matching identifier name')
  .argument('<string>', 'Identifier Name')
  .option('-g, --group [GROUP_NAME]', 'Optional Group Name, for narrowing the search index')
  .action(queryLinkAction)

program.parse();