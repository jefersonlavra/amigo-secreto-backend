export const encryptMatch = (id: number): string => {
    return `${process.env.TOKEN_DEFAULT}${id}${process.env.TOKEN_DEFAULT}`;
};

export const decryptMatch = (match: string): number => {
    let idString: string = match
        .replace(`${process.env.TOKEN_DEFAULT}`, "")
        .replace(`${process.env.TOKEN_DEFAULT}`, "");

    return parseInt(idString);
};