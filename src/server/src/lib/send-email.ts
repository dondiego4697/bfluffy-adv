import * as nodemailer from 'nodemailer';
import {Transporter} from 'nodemailer';
import {config} from 'server/config';
import {logger} from 'server/lib/logger';

interface Params {
    subject: string;
    text: string;
    html: string;
}

let transporterBase: Transporter | null = null;

export async function getTransporter() {
	if (transporterBase) {
		return transporterBase;
	}

	if (config['email.mock']) {
		const account = await nodemailer.createTestAccount();
		transporterBase = nodemailer.createTransport({
			host: 'smtp.ethereal.email',
			port: 587,
			secure: false,
			auth: {
				user: account.user,
				pass: account.pass
			}
		});
	} else {
		transporterBase = nodemailer.createTransport({
			host: 'smtp.yandex.ru',
			port: 465,
			secure: true,
			auth: {
				user: config['email.login'],
				pass: config['email.password']
			}
		});
	}

	return transporterBase;
}

export async function sendEmail(email: string, params: Params) {
	const transporter = await getTransporter();
	const info = await transporter.sendMail({
		from: `BFluffy ${config['email.login']}`,
		to: email,
		subject: params.subject,
		text: params.text,
		html: params.html
	});

	logger.info(`Send email message: ${JSON.stringify(info)}`);
}
