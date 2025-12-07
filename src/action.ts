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

        const data = await response.json();
        const { status } = data as { status: string };
        if (status === "success") buildSuccessMessage(`Added ${groupName}`);
        else buildFailMessage(`Unable to add group ${groupName}`);
    } catch (err) {
        console.error(err);
    }
};

export const removeGroupAction = async (groupName: string) => {
    try {
        const endpoint = `${appBaseUrl}/api/group/${groupName}`;

        const response = await fetch(endpoint, { method: "DELETE" });

        const data = await response.json();

        const { status, error } = data as { status: string, error: string };
        if (error) buildFailMessage(`${error}`);
        if (status === "success") buildSuccessMessage(`removed ${groupName}`);
    } catch (err) {
        console.error(err);
    }
};

export const showGroupAction = async () => {
    try {
        const endpoint = `${appBaseUrl}/api/group`;
        const response = await fetch(endpoint);
        const parsedData = await response.json();
        const {
            status,
            response: data,
            error,
        } = parsedData as { status: string; response: any; error: string };
        if (status === "failure")
            buildFailMessage(`Unable to fetch groups\n${error}`);
        else buildShowGroupMessage(data);
    } catch (err) {
        console.error(err);
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


        const data = await response.json();
        const { status, error } = data as { status: string, error: string };
        if (error) buildFailMessage(`${error}`);
        if (status == "success") buildSuccessMessage(`Added link ${url} to group ${groupName}`);
    } catch (err) {
        console.error(err);
    }
};

export const removeLinkAction = async (groupName: string, label: string) => {
    try {
        const endpoint = `${appBaseUrl}/api/link/${groupName}/${label}`;
        const response = await fetch(endpoint, { method: "DELETE" });
        const data = await response.json();
        const { status, error } = data as { status: string, error: string };
        if (error) buildFailMessage(`${error}`);
        if (status === "success") buildSuccessMessage(`removed ${label} from ${groupName}`);
    } catch (err) {
        console.error(err);
    }
};

export const showLinkAction = async (groupName: string) => {
    try {
        const endpoint = `${appBaseUrl}/api/group/${groupName}/link`;
        const response = await fetch(endpoint);
        const parsedData = await response.json();

        const { status, data, error } = parsedData as {
            status: string;
            data: any;
            error: string;
        };
        if (status === "failure") {
            buildFailMessage(`Unable to fetch links for ${groupName}\n${error}`);
            return;
        }

        if (status === "group not found") {
            buildFailMessage(`Group ${groupName} not found.`);
            return;
        }

        const linksData = data?.[0];
        if (!linksData) {
            buildFailMessage(`No links found in group ${groupName}`);
            return;
        }

        const values = Object.values(linksData).map((item) => {
            if (
                typeof item === "object" &&
                item !== null &&
                "label" in item &&
                "link" in item
            ) {
                return item;
            }
        }).filter(item => item != undefined) as Link[];

        buildShowLinksByGroupMessage(values)
    } catch (err) {
        console.error(err);
    }
};

export const queryLinkAction = async (
    identifier: string,
    option: { group: string }
) => {
    try {
        const { group } = option;
        const params = new URLSearchParams({ label: identifier });
        if (group) {
            params.append("group", group);
        }
        const endpoint = `${appBaseUrl}/api/link?${params.toString()}`;

        const response = await fetch(endpoint);
        const parsedData = await response.json();

        const { status, data, error } = parsedData as {
            status: string;
            data: any;
            error: string;
        };
        if (status === "failure") {
            buildFailMessage(`Unable to fetch links\n${error}`);
            return;
        }

        if (status === "label not found") {
            buildFailMessage("Link not found");
        } else {
            const results = data as { groupName: string; result: Link[] }[];
            if (!results || results.length === 0) {
                buildFailMessage("No links found matching the criteria.");
                return;
            }
            buildShowLinksByLabelMessage(results)
        }
    } catch (err) {
        console.error(err);
    }
};
