import { closeRedisConn, connectRedis } from "./redis/client";
import { addGroup, addLinkToGroup, removeGroup, removeLinkFromGroup, showGroups, showLinksByLabel, showLinksInGroup, type Link } from "./redis/link"

export const addGroupAction = async (groupName: string) => {
    try {
        await connectRedis();
        const response = await addGroup(groupName);
        if (response.status === "success") console.log(`added group ${groupName}`)
        else console.log(`unable to add group ${groupName}`)
    } catch (err) {
        console.error(err);
    } finally {
        await closeRedisConn();
    }
}

export const removeGroupAction = async (groupName: string) => {
    try {
        await connectRedis();
        const response = await removeGroup(groupName);
        if (response.status === "success") console.log(`removed group ${groupName}`)
        else console.log('unable to remove group');
    } catch (err) {
        console.error(err);
    } finally {
        await closeRedisConn();
    }
}

export const showGroupAction = async () => {
    try {
        await connectRedis();
        const response = await showGroups();
        if (response.status === "success") {
            console.log('Here are the groups');
            response.response?.forEach((item) => console.log(item));
        }
        else console.log('unable to fetch groups');
    } catch (err) {
        console.error(err);
    } finally {
        await closeRedisConn();
    }
}

export const addLinkAction = async (groupName: string, label: string, url: string) => {
    try {
        await connectRedis();
        const response = await addLinkToGroup(groupName, { label: label, link: url })
        console.log(response);
        if (response.status === "failure") throw new Error()
        console.log(`added link ${label} to ${groupName}`);
    } catch (err) {
        console.log('unable to add link');
        console.error(err);
    } finally {
        await closeRedisConn()
    }
}

export const removeLinkAction = async (groupName: string, label: string) => {
    try {
        await connectRedis();
        const response = await removeLinkFromGroup(groupName, label)
        console.log(response);
        if (response.status === "failure") throw new Error()
        console.log(`removed link ${label} to ${groupName}`);
    } catch (err) {
        console.log('unable to remove link');
        console.error(err);
    } finally {
        await closeRedisConn()
    }
}

export const showLinkAction = async (groupName: string) => {
    try {
        await connectRedis();
        const response = await showLinksInGroup(groupName)
        if (response.status === "failure") throw new Error()
        Object.values(response.data?.[0]).forEach((item) => {
            if (typeof item === "object" && item !== null && "label" in item && "link" in item) {
                const { label, link } = item as Link;
                console.log(`${label}\t${link}`);
            }
        });

    } catch (err) {
        console.log('unable to fetch links');
        console.error(err);
    } finally {
        await closeRedisConn()
    }
}


export const queryLinkAction = async (identifier:string, option: { group: string }) =>  {
    try {
        await connectRedis();
        const { group } = option;
        const response = await showLinksByLabel(identifier, group);
        if (response.status === "failure") throw new Error(response.error)
        if (response.status === "label not found") console.log("Link not found")
        else {
            const results = response.data;
            results?.forEach((item) => {
                console.log(`group - ${item.groupName}`)
                item.result.forEach((item: Link) => console.log(`${item.label}\t${item.link}`))
            })
        }
    } catch (err) {
        console.log('unable to fetch links');
        console.error(err);
    } finally {
        await closeRedisConn()
    }
}   

