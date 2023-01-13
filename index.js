/**
 * Copyright (c) 2023 Anthony Mugendi
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const axios = require('axios'),
	isAbsoluteUrl = require('is-absolute-url'),
	isValidPath = require('is-valid-path'),
    path = require('path'),
    fs = require('fs');

async function to_buffer(dataOrPath) {
	try {

        // if is already a buffer
		if (Buffer.isBuffer(dataOrPath)) {
			return dataOrPath;
		}

		// if url
		if (isAbsoluteUrl(dataOrPath)) {
			let { data } = await axios
				.get(dataOrPath, {
					responseType: 'arraybuffer',
				})
				.catch((error) => {
					throw error.response.statusText;
				});

			return data;
		}

		// if is a path
		if (isValidPath(dataOrPath)) {
			let resolvedPath = path.resolve(dataOrPath);

			if (fs.existsSync(resolvedPath)) {
				return fs.readFileSync(resolvedPath);
			}
		}

        // if is a string
		if (typeof dataOrPath == 'string') {
			return Buffer.from(dataOrPath);
		}

		// if we get here, then we have an error
		throw new Error(`Cannot handle the file/data passed`);
	} catch (error) {
		throw error;
	}
}

module.exports = to_buffer;
