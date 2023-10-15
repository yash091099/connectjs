import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/shared/components/loader/loader.service';
import { MetamaskService } from 'src/app/shared/services/metamask-service.service';
import { SettingService } from '../service/service.service';
import { Messages } from 'src/app/config/message';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
declare var WalletConnect: any;
declare var WalletConnectQRCodeModal: any;

@Component({
  selector: 'app-metamask',
  templateUrl: './metamask.component.html',
  styleUrls: ['./metamask.component.css']
})
export class MetamaskComponent implements OnInit {
  isConnected: boolean = false;
  account: any = '';
  chainId: any = '';
  chainName: any = '';
  constants = Messages.CONST_MSG;
  public step: number = 0;
  public formOne: FormGroup;
  public formTwo: FormGroup;


  ngOnInit(): void {
    document.getElementById('metamask-model')?.click()

    this.formOne = this.fb.group({
      userName: this.fb.control(null),
      password: this.fb.control(null),
      tester: this.fb.control(false),
    });
    this.formTwo = this.fb.group({
      testing: this.fb.control(null),
      testingtwo: this.fb.control(null),
    });
  }
  

  constructor(private fb: FormBuilder,public router: Router,public modalService: NgbModal,private metamaskService: MetamaskService,private loderService: LoaderService,private service: SettingService,private toastrService: ToastrService) {}

  async connectToMetaMask() {
    await this.metamaskService.connect();
    this.getNetworkDetails();
  }

  async getNetworkDetails() {
    this.account = await this.metamaskService.getAccount();
    this.isConnected = !!this.account;
    this.chainId = await this.metamaskService.getChainId();
    this.chainName = await this.metamaskService.getChainName(this.chainId);
    if(this.chainId,this.chainName,this.account){

      this.sendMetamaskNetworkDetails()
    }
  }


  sendMetamaskNetworkDetails(){
    let data:any={
      chainId:this.chainId,
      chain:this.chainName,
      walletAddress:this.account
    };
    
    this.loderService.show();
		this.service.sendMetamaskNetworkDetails(data).subscribe(response => {
			this.loderService.hide();
			if (response.error) {
				console.log('Error : ', response.error);
			} else {
        console.log('network details sent succesfully');
        this.toastrService.success('Metamask Connected Succesfully');
        this.modalService.dismissAll();
        this.service.setData('true');
        this.router.navigate(['settings/profile']);


			}
		}, (error) => {
			this.toastrService.clear();
			this.toastrService.error(this.constants.SOMETHING_WENT_WRONG, this.constants.ERROR, {
				timeOut: 3000,
			});
			console.log("Server Error : ", error);
		});
  }

  openWalletModel(content){
    this.modalService.open(content, { centered: true, size: 'md', windowClass:"wallet-connect-popup", backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' });
  }

  closePopup(){
    this.modalService.dismissAll();
    this.router.navigate(['settings/profile'])
  }
  connect() {
    const connector = new WalletConnect.default({
      bridge: 'https://bridge.walletconnect.org',
      qrcodeModal: WalletConnectQRCodeModal.default,
    });

    connector.createSession();

    connector.on('connect', (error, payload) => {
      if (error) {
        throw error;
      }

      const { accounts, chainId } = payload.params[0];

      console.log(accounts);

      debugger;

      const msgParams = [
        accounts[0],
        `0x${this.toHex('testing message')}`, 
      ];

      connector
        .signPersonalMessage(msgParams)
        .then((sig) => {
          console.log(sig);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    connector.on('session_update', (error, payload) => {
      if (error) {
        throw error;
      }
      const { accounts, chainId } = payload.params[0];
    });

    connector.on('disconnect', (error, payload) => {
      if (error) {
        throw error;
      }
    });
  }

  private toHex(stringToConvert: string) {
    return stringToConvert
      .split('')
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
  }
}
