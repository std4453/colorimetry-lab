import spectrum from './spectrum';

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

spectrum({ canvas, ctx });
