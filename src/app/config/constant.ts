export class Constants {
	public static get downlineLevel() {
		return [1];
	}

	public static get IMAGE_SIZE() {
		return 5 * (2 ** 20);
	}


	public static get COLOR_SCHEME() {
		return {
			COLOR_1: "#a34a06",
			COLOR_2: "#f4aa01",
		};
	}
	public static get MIN_WITHDRAW_AMOUNT() {
		return 50;
	}
	public static get MIN_DEPOSIT_AMOUNT() {
		return 25;
	}

	public static get isInviteScreen() {
		return false;
	}

	public static get copyData() {
		return {
			COPY_LINK: 'Copy',
			COPIED: 'Copied',
			COPY_BANNER_Code: 'Copy Banner Code',
			COPY_Refer_LINK: 'Copy link'
		};
	}

	public static get folder_to_upload() {
		return {
			USER: "USER",
			USERKYC: "USERKYC",
		};
	}
	public static get IMAGE_URL() {
		return {
			BRDG: "brg.jpeg",
			GOB: "../../assets/images/we.png",
			DEFAULT: "../../assets/images/wallet.png"
		};
	}
	public static get reportSubType() {
		return [
			{ key: "NEWSLETTER", value: "Newsletter" },
			{ key: "TDINSIGHTS", value: "TD Insights" },
			{ key: "SECTORALWATCH", value: "Sectoral Watch" },
			{ key: "CRYPTORECAP", value: "Crypto Recap" },
		];
	}

	public static get reportsArray() {
		return [
			{
				key: "MONTHLYREPORT",
				value: "Monthly Factsheet",
				image: "../../../../assets/images/monthly-report.png",
			},
			{
				key: "QUARTERLYREPORT",
				value: "Quarterly Factsheet",
				image: "../../../../assets/images/qutar.png",
			},
			{
				key: "YEARLYREPORT",
				value: "Yearly Factsheet",
				image: "../../../../assets/images/yerly.png",
			},
			{
				key: "LITEREPORT",
				value: "Recommended Lite",
				image: "../../../../assets/images/lite-report.png",
			},
			{
				key: "INDEPTHREPORT",
				value: "Recommended Indepth",
				image: "../../../../assets/images/deaft-report.png",
			},
		];
	}

	public static get marqueeData() {
		return [
			{
				text: "Goons of Balatroon announces IDO on TDX Launchpad",
				href: "https://medium.com/@TDXLaunch/goons-of-balatroon-announces-ieo-on-tdx-launchpad-dedf4d657497",
			},
			{
				text: "TDX launchpad second tranche release ($BRDG) ",
				href: " https://medium.com/@TDXLaunch/tdx-launchpad-second-tranche-release-brdg-5894d197b373",
			},
			{
				text: " TDX launchpad withdraw system ",
				href: "https://medium.com/@TDXLaunch/tdx-launchpad-withdraw-process-8ae5c4f3b996 ",
			},
			{
				text: " TDX launchpad allocation system ",
				href: "https://medium.com/@TDXLaunch/tdx-launchpad-allocation-system-8cb0f89a56c",
			},
			{
				text: " $BRDG sale on TDX launchpad: a step-by-step guide ",
				href: "https://medium.com/@TDXLaunch/brdg-sale-on-tdx-launchpad-a-step-by-step-guide-7a1a395bdc1d",
			},
			{
				text: " Bridge Network announces IDO on TDX launchpad ",
				href: "https://medium.com/@TDXLaunch/bridge-network-announces-ido-on-tdx-launchpad-e78f6f865011 ",
			},
		];
	}
	public static get SELECTED_TAB() {
		return {
			ANATYTICS: "analytics",
			REFER_EARN: "refer-earn",
			REFER_CAMPAIGNS: "referral-campaigns",
		};
	}

	public static get ANALYTICS() {
		return {
			ANATYTICS: "analytics",
			DEFAULT: "DEFAULT",
			APPROVED: "APPROVED",
			PREVIOUS_TAB: "previousTab",
		};
	}

	public static get SHOUT_OUT() {
		return {
			FOLLOW: { text: 'Follow @TDX on Twitter', reward: '$50' },
			TWEET_GITEX: { text: 'Tweet about TDX at Gitex', reward: '$50' },
			TWEET_LAUNCHPAD: { text: 'Tweet about TDX launchpad', reward: '$50' },
			TELEGRAM: { text: 'Visit TDX on telegram', reward: '$50' },
		};
	}

	public static get SOCIAL_CONNECTIONS() {
		return {
			TWITTER: "Twitter",
			DISCORD: "Discord",
			TELEGRAM: "Telegram",
			RETWEET: "Retweet",
			LIKE: "Like",
			WATCH: "Watch",
			QUOTE: "Quote",
			MENTION: "Mention",
			COMMENT: "Comment",
			YOUTUBE: "Youtube",
			FOLLOW: "Follow",
			SUBSCRIBE: "Subscribe",
			GROUP: "Group",
			JOIN_CHAT: "Join & Chat",
			TWEET: "Tweet",
			VISIT: "Visit",
			WEBSITE: "Website",
			OTHER: "Other",
			ENGAGEMENT: "Engagement",
			SIGNUP: "Signup"
		}
	}

	public static get TABS() {
		return {
			TRANSACTIONS: 'TRANSACTIONS',
			ACTIVITY_LOGS: 'ACTIVITY_LOGS'
		}
	}
	public static get WITHDRAW_TABS() {
		return {
			WALLET: 'WALLET',
			COMMISSION: 'COMMISSION'
		}
	}
	public static get TRANSACTION_STATUS() {
		return {
			COMPLETED: "COMPLETED",
			CANCELLED: "CANCELLED",
			UNDER_REVIEW: 'UNDER_REVIEW',
			ONGOING: 'ONGOING'
		};
	}

	public static get COMMISION_TYPE() {
		return {
			CREDIT: "CREDIT",
			DEBIT: "DEBIT",
		};
	}

	public static get SELECT_CAMPAIGN_TYPE() {
		return {
			PAGE: "PAGE",
			BANNER: "BANNER",
		};
	}

	public static get PAYMODE() {
		return {
			WALLET: "wallet",
			COUPONS: "coupons",
			LTC: 'LTC',
			LTCT: 'LTCT',
			BTC: 'BTC',
			ETH: 'ETH',
			TETHER_BLOCK_IO: 'tetherBlockIO',
			USDT_ERC20: 'USDT.ERC20',
			USDT: 'USDT',
			USDT_TRC20: 'USDT.TRC20',
			USDT_USDT_ERC20: 'USDT(USDT.ERC20)',
			USDT_USDT_TRC20: 'USDT(USDT.TRC20)',
			USDT_BEP20: 'USDT.BEP20',
			USDT_USDT_BEP20: 'USDT(USDT.BEP20)',
			BUSD: 'BUSD',
			BUSD_BEP20: 'BUSD.BEP20',
			USDC: 'USDC',
			USDC_USDC_ERC20: 'USDC(USDC.ERC20)',
			USDC_BEP20: 'USDC.BEP20',
			LITE_COIN_BLOCK_IO: 'litecoinBlockIO',
			BITCOIN_BLOCK_IO: 'bitcoinBlockIO',
			ETHERIUM_BLOCK_IO: 'etheriumBlockIO',
			MIXED: 'mixed'
		};
	}

	public static get USD_WALLET_LOG_STATUS() {
		return {
			PENDING: "PENDING",
			CANCELLED: "CANCELLED",
			PROCESSING: 'PROCESSING',
			ONHOLD: 'ONHOLD',
			FAILED: 'FAILED',
			COMPLETED: 'COMPLETED',
			SETTLED: 'SETTLED',
			REJECTED: 'REJECTED'
		};
	}

	public static get REFER_SELECTED_TAB() {
		return ['refer-earn', 'referral-campaigns', 'analytics']
	}

	public static get COIN_NAME() {
		return {
			BTC: "BTC",
			LTC: "LTC",
			ETH: 'ETH',
			USDT: 'USDT',
			BUSD: 'BUSD',
			USDC: 'USDC',
			LTCT: 'LTCT',
			USDTERC: 'USDTERC',
			USDTTRC: 'USDTTRC',
			USDCERC: 'USDCERC'
		};
	}
	public static get TWITTER_URL() {
		return "https://twitter.com/login?lang=en"
	}
	public static get MODAL_TYPE(){
		return {
			CLAIMED: 'claimed',
			NOT_CLAIMED: 'notClaimed',
			ERROR: 'Error',
			SUCCESS: 'Success'
		}
	}
	public static get TASK_CONFIRMTION_CONTENT(){
		return{
		Telegram:
		{"Join & Chat":"Did you join the group",
		"Group":"Did you join the group"},        
		Discord:
		{"Join & Chat":"Did you join the group",
		"Group":"Did you join the group"},        
		Twitter:
		{"Tweet":"Did you post the message",
		"Like":"Did you like the post",
		"Quote":"Did you post the quote",
		"Comment":"Did you comment on the post",
		"Retweet":"Did you retweet the post",
		"Follow":"Did you follow the account"},
		Youtube:
		{"Like":"Did you like the video",
		"Watch":"Did you watch the video",
		"Subscribe":"Did you subscribe the channel"},
		Website:
		{"Visit":"Did you visit the website"},
		Other: 
		{"Signup":"Did you perform the task by following the mentioned instructions",
		"Visit":"Did you visit the website",
	}
		}
	}
	

	public static get STARTUP_ROUND_STATUS() {
		return {
			ONGOING: "ONGOING",
			UPCOMING: "UPCOMING",
			CLOSED: 'CLOSED',
		};
	}

	public static get WALLET_LOG_TYPE() {
		return {
			DEBIT: "DEBIT",
			PURCHASE: 'PURCHASE',
			CREDIT: 'CREDIT',
			EARNING_DEBIT: 'EARNINGDEBIT',
			EARNING_CREDIT: 'EARNINGCREDIT',
			COMMISSION_WALLET: 'COMMISSION_WALLET'
		};
	}
}
