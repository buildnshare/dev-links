import chalk from 'chalk';
import type { Link } from './action';

export const log = console.log;

export const buildSuccessMessage = (message: string) => {
    /* Terminal message designed, for a successfull action performed. Eg: Successfully added group, link ..etc */
    const label = chalk.bold.greenBright('Success');
    const icon  = chalk.bold.green('[ ✔ ]');
    const display = `${icon} ${label} ${(message)}`;
    log(display);
}

export const buildFailMessage = (message: string) => {
    /* Terminal message designed, for a failed action performed. Eg: unable to add group, link ..etc */
    const label = chalk.bold.redBright('Failed');
    const icon  = chalk.bold.red('[ ✖ ]');
    const display = `${icon} ${label} ${(message)}`;
    log(display);
}

export const buildShowGroupMessage = (groups: Array<String>) => {
    const header = chalk.bold.greenBright('Groups');
    log(header);
    
    const tableFormat = groups.map(item => chalk.blueBright.bold(item))
    console.table(tableFormat)
}


export const buildShowLinksByGroupMessage = (values: Array<Link>) => {
    const header = chalk.bold.yellow('Links');
    log(header);

    console.table(values);
}

export const buildShowLinksByLabelMessage = (values: Array<{
    groupName: string;
    result: Link[];
}>) => {
    const header = chalk.bold.green('Search Results');
    log(header);

    values.forEach((item) => {
        const groupHeader = chalk.bold.blueBright(item.groupName);
        log(groupHeader);
        
        console.table(item.result);
    })
}