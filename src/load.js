import papa from 'papaparse';

const load = async (url) => {
    const response = await fetch(url);
    const text = await response.text();
    return papa.parse(text).data;
};

export default load;
