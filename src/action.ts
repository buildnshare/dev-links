import config from "../config";
import { buildFailMessage, buildShowGroupMessage, buildShowLinksByGroupMessage, buildShowLinksByLabelMessage, buildSuccessMessage } from "./styles";

const appBaseUrl = `${config.server.protocol}://${config.server.host}:${config.server.port}`;

export type Link = { label: string; link: string };

export const addGroupAction = async (groupName: string) => {
    try {
        const response = await fetch(`${appBaseUrl}/api/group`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                groupName: groupName,
            }),
        });

        const parsedResponse = await response.json() as { error? : string, success?: string };
        !response.ok ? buildFailMessage(parsedResponse.error!) : buildSuccessMessage(parsedResponse.success!);
    } catch (err) {
        buildFailMessage(`Unable to add group ${err}`);
    }
};

export const removeGroupAction = async (groupName: string) => {
    try {
        const endpoint = `${appBaseUrl}/api/group/${groupName}`;

        const response = await fetch(endpoint, { method: "DELETE" });

        const data = await response.json() as { error?: string, success?: string};
        !response.ok ? buildFailMessage(data.error!) : buildSuccessMessage(data.success!);  
    } catch (err) {
        buildFailMessage(`Unable to remove group ${err}`)
    }
};

export const showGroupAction = async () => {
    try {
        const endpoint = `${appBaseUrl}/api/group`;
        const response = await fetch(endpoint);
        const parsedData = await response.json() as { error? : string, data?: Array<string>};
        !response.ok ? buildFailMessage(parsedData.error!) : buildShowGroupMessage(parsedData.data!);
    } catch (err) {
        buildFailMessage(`unable to fetch groups ${err}`)
    }
};

export const addLinkAction = async (
    groupName: string,
    label: string,
    url: string
) => {
    try {
        const response = await fetch(`${appBaseUrl}/api/link`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                group: groupName,
                label: label,
                link: url,
            }),
        });


        const data = await response.json() as { error? : string, success?: string};
        !response.ok ? buildFailMessage(data.error!) : buildSuccessMessage(data.success!);
    } catch (err) {
        buildFailMessage(`unable to add link ${err}`)
    }
};

export const removeLinkAction = async (groupName: string, label: string) => {
    try {
        const endpoint = `${appBaseUrl}/api/link/${groupName}/${label}`;
        const response = await fetch(endpoint, { method: "DELETE" });
        const data = await response.json() as { error? : string, success?: string};
        response.ok ? buildFailMessage(data.error!) : buildSuccessMessage(data.success!);
    } catch (err) {
        buildFailMessage(`Unable to remove link ${err}`)
    }
};

export const showLinkAction = async (groupName: string) => {
    try {
        const endpoint = `${appBaseUrl}/api/group/${groupName}/link`;
        const response = await fetch(endpoint);
        const parsedData = await response.json() as { error?: string, data?: any};

        if (!response.ok ) {
             buildFailMessage(parsedData.error!);
             return ;
        }

        parsedData.data.forEach((item: { groupName: string, links: Link[] }) => buildShowLinksByGroupMessage(item.links))
    } catch (err) {
        buildFailMessage(`Unable to fetch links ${err}`)
    }
};

export const queryLinkAction = async (
    identifier: string,
    option: { group: string }
) => {
    try {
        const { group } = option;
        const params = new URLSearchParams({ label: identifier });
        if (group != undefined) params.append("group", group);


        const endpoint = `${appBaseUrl}/api/link?${params.toString()}`;

        const response = await fetch(endpoint);
        const parsedData = await response.json() as { error?: string, data?: Array<{ groupName: string, result: Link[]}>};

        if (!response.ok) {
            buildFailMessage(parsedData.error!)
            return ;
        }

        const results = parsedData.data!;
        buildShowLinksByLabelMessage(results)
    } catch (err) {
        console.error(err);
    }
};
