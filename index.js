/**
 * Copyright (c) 2023 Anthony Mugendi
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const axios = require('axios'),
	isAbsoluteUrl = require('is-absolute-url'),
	isValidPath = require('is-valid-path'),
	logger = require('debug-symbols')('file-to-buffer');

async function to_buffer(dataOrPath) {
	try {
		if (Buffer.isBuffer(dataOrPath)) {
			logger.debug('Upload is a Buffer');
			return dataOrPath;
		}

		// if url
		if (isAbsoluteUrl(dataOrPath)) {
			logger.debug('Upload is a URL');

			let { data } = await axios
				.get(dataOrPath, {
					responseType: 'arraybuffer',
				})
				.catch((error) => {
					throw error.response.statusText;
				});

			return data;
		}

		// check if is a path
		if (isValidPath(dataOrPath)) {
			let resolvedPath = path.resolve(dataOrPath);

			if (fs.existsSync(resolvedPath)) {
				logger.debug('Upload is a File');
				return fs.readFileSync(resolvedPath);
			}
		}

		// if we get here, then we have an error
		throw new Error(`Cannot handle the file/data passed`);
	} catch (error) {
		throw error;
	}
}


module.exports = to_buffer