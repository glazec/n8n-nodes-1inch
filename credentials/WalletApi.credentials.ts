import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class WalletApi implements ICredentialType {
	name = 'walletApi';
	displayName = 'Wallet API';
	documentationUrl = 'https://github.com/glazec/n8n-nodes-1inch';
	properties: INodeProperties[] = [
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			default: '',
			required: true,
			description: 'Private key of the wallet',
		},
	];
	// test(request: ICredentialTestRequest): Promise<IAuthenticateGeneric> {
	// 	// @ts-ignore
	// 	const { privateKey } = request.credentials;
	// 	const web3 = new Web3(`https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`);
	// 	const account = web3.eth.accounts.privateKeyToAccount(privateKey);
	// 	return Promise.resolve({ success: true, message: 'Authentication successful' });
	// }
}
