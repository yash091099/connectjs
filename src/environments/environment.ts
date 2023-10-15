// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	baseURL: 'https://xyz-api.tdx.biz/',
	clientUrl: 'https://xyz.tdx.biz/',
	// baseURL: 'http://192.168.29.240:8200/',
	// baseURL: 'http://192.168.111.108:8200/',
	// baseURL: 'http://localhost:8200/',
	// clientUrl: 'http://localhost:4200/',
	// clientUrl: 'https://app.tdx.biz/',
	headerName: 'authorization',
	// fetchKYC: false,
	// fetchKYC: true,
	// saleStarted: false,

	SITE_KEY: "6LdJLxAaAAAAACGsDDrAFzfIfkOXWIrqDFkPKit6",
	saleStarted: true,
	showPaymentMethod: false,
	authScheme: 'Bearer ',
	bitcoinBlockIO: 'BTC',
	litecoinBlockIO: 'LTCT',
	etheriumBlockIO: 'ETH',
	depositPayModes: [
		{ name: 'LTC', subName: 'LTCT', value: 'LTCT', image: '../../../assets/images/ltc.png' },
	],
	withdrawPayModes:[
		{ name: 'LTC', subName: 'LTCT', value: 'LTCT', image: '../../../assets/images/ltc.png' },
	],
	tetherBlockIO: 'USDT.BEP20',
	etherBlockIOERC: 'USDT.ERC20',
	tetherBlockIOTRC: 'USDT.TRC20',
	etherBlockIODC: 'USDC',

	BUSD: 'BUSD.BEP20',
	USDC: 'USDC.BEP20',
	whitelistedDomains: [],
	blacklistedRoutes: [],
	build: 7
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
