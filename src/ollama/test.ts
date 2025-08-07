import {ask, askJson} from "./ollama";

const structure = {
    tags: []
};

try {
    const response = await askJson('give me an object with of strings, see the structure', structure);
    console.log('Response:', response);
} catch (error) {
    console.error('Error:', error.message);
}