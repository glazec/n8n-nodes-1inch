// @ts-nocheck
import { IExecuteFunctions } from 'n8n-core';
import { IDataObject, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import axios from 'axios';
import { ethers } from 'ethers';
import { oneInchSwap } from './1inch';

export class OneInch implements INodeType {
	description: INodeTypeDescription = {
		displayName: '1inch',
		name: 'OneInch',
		icon: 'file:OneInchLogo.svg',
		group: ['transform'],
		version: 1,
		description: 'Token swap using 1inch',
		defaults: {
			name: 'OneInch',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'walletApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Chain',
				name: 'chainId',
				type: 'options',
				options: [
					{ name: 'Ethereum', value: 1 },
					{ name: 'Binance Smart Chain', value: 56 },
					{ name: 'Polygon', value: 137 },
					{ name: 'Optimism', value: 10 },
					{ name: 'Arbitrum', value: 42161 },
					{ name: 'Gnosis Chain', value: 100 },
					{ name: 'Avalanche', value: 43114 },
					{ name: 'Fantom', value: 250 },
					{ name: 'Klaytn', value: 8217 },
					{ name: 'Aurora', value: 1313161554 },
				],
				default: 1,
				required: true,
				description: 'The ID of the chain to send transactions to',
			},
			{
				displayName: 'RPC Address',
				name: 'rpcAddress',
				type: 'string',
				default: 'https://arbitrum-mainnet.infura.io/v3/6f00d07c00804205a7dae7f8d4f75fcc',
				required: true,
				description: 'The RPC address to send transactions to',
			},
			{
				// USDT Address on Arbitrum
				displayName: 'Input Token Address',
				name: 'inputTokenAddress',
				type: 'string',
				default: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
				required: true,
				description: 'The address of the token to send transactions to',
			},
			{
				// DAI Address on Arbitrum
				displayName: 'Output Token Address',
				name: 'outputTokenAddress',
				type: 'string',
				default: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
				required: true,
				description: 'Whether to output the token address as a string',
			},
			{
				displayName: 'Input Token Amount',
				name: 'inputTokenAmount',
				type: 'number',
				default: 100,
				required: true,
				description: 'The amount of input token to send. Notice the decimals.',
			},
			{
				displayName: 'Slippage',
				name: 'slippage',
				type: 'number',
				default: 1,
				required: true,
				description: 'Min: 0; max: 50',
			},
		],
	};
	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const privateKey = (await this.getCredentials('walletApi')).privateKey;
		console.log(privateKey);
		// Handle data coming from previous nodes
		const items = this.getInputData();
		let responseData;
		const returnData = [];
		for (let i = 0; i < items.length; i++) {
			// Get additional fields input
			const data: IDataObject = {
				chainId: this.getNodeParameter('chainId', i) as number,
				rpcAddress: this.getNodeParameter('rpcAddress', i) as string,
				inputTokenAddress: this.getNodeParameter('inputTokenAddress', i) as string,
				outputTokenAddress: this.getNodeParameter('outputTokenAddress', i) as string,
				inputTokenAmount: this.getNodeParameter('inputTokenAmount', i) as number,
				slippage: this.getNodeParameter('slippage', i) as number,
			};
			Object.assign(data);
			let swapResult = await oneInchSwap(
				data.inputTokenAddress,
				data.outputTokenAddress,
				data.inputTokenAmount,
				privateKey,
				data.rpcAddress,
				data.chainId,
				data.slippage?.toString(),
			);
			returnData.push({
				hash: swapResult.hash,
				to: swapResult.to,
				from: swapResult.from,
				nonce: swapResult.nonce,
				gasLimit: swapResult.gasLimit,
				value: swapResult.value,
				chainId: swapResult.chainId,
			});

			// Map data to n8n data structure
			return [this.helpers.returnJsonArray(returnData)];
		}
	}
}
