import parse from 'csv-parse/lib/sync';

const load = async (url) => {
    const response = await fetch(url);
    const text = await response.text();
    return parse(text);
};

export default load;
