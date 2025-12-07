import config from "../config";

const appBaseUrl = `${config.server.protocol}://${config.server.host}:${config.server.port}`

type Link = { label: string, link: string };

export const addGroupAction = async (groupName: string) => {
    try {
        const response = await fetch(`${appBaseUrl}/api/group`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                groupName: groupName
            })
        });
        
        const data = await response.json();
        const { status } = data as { status: string};
        if (status === "success") console.log(`Added group ${groupName}`)
        else console.log(`Unable to add group ${groupName}`)
    } catch (err) {
        console.error(err);
    }
}

export const removeGroupAction = async (groupName: string) => {
    try {
       const endpoint = `${appBaseUrl}/api/group/${groupName}`
       const response = await fetch(endpoint, { method: 'DELETE'})
       const data = await response.json();
       const { status } = data as { status: string }
       if (status === "failure") console.log(`Unable to remove ${groupName}`)
       else console.log(`removed ${groupName}`)
    } catch (err) {
        console.error(err);
    }
}

export const showGroupAction = async () => {
    try {
        const endpoint = `${appBaseUrl}/api/group`
        const response = await fetch(endpoint);
        const parsedData = await response.json();
        const { status, response: data, error} = parsedData as { status: string, response: any, error: string}
        if (status === "failure") console.log(`Unable to fetch groups\n${error}`)
        else console.log(data);
    } catch (err) {
        console.error(err);
    }
}

export const addLinkAction = async (groupName: string, label: string, url: string) => {
    try {
        const response = await fetch(`${appBaseUrl}/api/link`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                group: groupName,
                label: label,
                link: url
            })
        });
        
        const data = await response.json();
        const { status } = data as { status: string};
        if (status === "failure") console.log(`Unable to add link to group ${groupName}`)
        else console.log(`Added link to group ${groupName}`)
    } catch (err) {
        console.log('unable to add link');
        console.error(err);
    }
}

export const removeLinkAction = async (groupName: string, label: string) => {
    try {
        const endpoint = `${appBaseUrl}/api/link/${groupName}/${label}`
        const response = await fetch(endpoint, { method: 'DELETE'});
        const data = await response.json();
        const { status } = data as { status: string };
        if (status === "failure") console.log(`Unable to remove link ${label} from ${groupName}`)
        else console.log(`removed link ${label} from ${groupName}`)
    } catch (err) {
        console.log('unable to remove link');
        console.error(err);
    }
}

export const showLinkAction = async (groupName: string) => {
    try {
        const endpoint = `${appBaseUrl}/api/group/${groupName}/link`;
        const response = await fetch(endpoint);
        const parsedData = await response.json();
        
        
        const { status, data, error} = parsedData as { status: string, data: any, error: string}
        if (status === "failure") {
            console.log(`Unable to fetch links for ${groupName}\n${error}`);
            return;
        }

        if (status === "group not found") {
            console.log(`Group ${groupName} not found.`);
            return;
        }

        const linksData = data?.[0];
        if (!linksData) {
            console.log(`No links found in group ${groupName}`);
            return;
        }

        Object.values(linksData).forEach((item) => {
            if (typeof item === "object" && item !== null && "label" in item && "link" in item) {
                const { label, link } = item as Link;
                console.log(`${label}\t${link}`);
            }
        });

    } catch (err) {
        console.log('unable to fetch links');
        console.error(err);
    }
}

export const queryLinkAction = async (identifier:string, option: { group: string }) =>  {
    try {
        const { group } = option;
        const params = new URLSearchParams({ label: identifier });
        if (group) {
            params.append('group', group);
        }
        const endpoint = `${appBaseUrl}/api/link?${params.toString()}`;

        const response = await fetch(endpoint);
        const parsedData = await response.json();

        const { status, data, error} = parsedData as { status: string, data: any, error: string}
        if (status === "failure") {
            console.log(`Unable to fetch links\n${error}`);
            return;
        }

        if (status === "label not found") {
            console.log("Link not found");
        } else {
            const results = data as { groupName: string, result: Link[] }[];
            if (!results || results.length === 0) {
                console.log("No links found matching the criteria.");
                return;
            }
            results?.forEach((item) => {
                console.log(item.groupName);
                item.result.forEach((linkItem: Link) => console.log(`\t${linkItem.label}\t${linkItem.link}`));
            })
        }
    } catch (err) {
        console.log('unable to fetch links');
        console.error(err);
    }
}
