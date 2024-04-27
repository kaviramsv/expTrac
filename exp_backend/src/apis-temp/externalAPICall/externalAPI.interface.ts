import fastJSON from 'fast-json-stringify';

export const stringify = (mySchema: fastJSON.AnySchema) => {
    return fastJSON(mySchema);
};
