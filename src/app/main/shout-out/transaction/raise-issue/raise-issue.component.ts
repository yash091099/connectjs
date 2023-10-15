import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/shared/components/loader/loader.service';
import { ShoutOutService } from '../../service/shout-out.service';
import noWhitespaceValidator from 'src/app/shared/services/no-white-space-validator.service';
import { Constants } from 'src/app/config/constant';
import { Messages } from 'src/app/config/message';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-raise-issue',
	templateUrl: './raise-issue.component.html',
	styleUrls: ['./raise-issue.component.css']
})
export class RaiseIssueComponent implements OnInit {

	/******EventEmitter*****/
	@Input() taskLogId = '';
	@Input() actionTimestampsId = '';
	@Output() getActivityList = new EventEmitter<any>();
	/*********Form*********/
	reportIssueForm: FormGroup;
	/*********String*********/
	attachmentPreview: any = '';
	selectedAttachment: any = ''
	uploadAttachmentUrl: any = ''
	uploadAttachment: any = ''
	/*********Constant*********/
	message = Messages.CONST_MSG
	/*********Boolean*********/
	isAttachment: boolean = false;

	constructor(
		private modalService: NgbModal,
		private fb: FormBuilder,
		private toastrService: ToastrService,
		private loaderService: LoaderService,
		private shoutOutService: ShoutOutService,
	) { }

	ngOnInit(): void {
		this.createForm();
	}

	/**
	 * @description: used to create report issue form
	 */
	createForm() {
		this.reportIssueForm = this.fb.group({
			description: ['', [Validators.required, noWhitespaceValidator, Validators.maxLength(300)]],
			attachments: [null]
		});
	}

	get description(): any { return this.reportIssueForm.get('description'); }
	get attachments(): any { return this.reportIssueForm.get('attachments'); }


	/**
	 * @description: on change function of select attachment
	 * @param $event: file input event 
	 * @param fileInput : file input event
	 */
	onSelectAttachment($event, fileInput: any) {
		if (!$event.target.files.length) {
			return false;
		}
		let file = $event.target.files[0];
		this.selectedAttachment = null;
		let typeArray = ["jpeg", "png", "jpg"];
		if (!typeArray.includes(file?.name?.split(".")?.pop()?.toLowerCase())) {
			this.reportIssueForm.patchValue({
				attachments: null
			})
			this.toastrService.error(this.message.SELECT_PROPER_IMG_FILE);
			return false;
		}
		if (file.size > Constants.IMAGE_SIZE) {
			this.reportIssueForm.patchValue({
				attachments: null
			})
			this.toastrService.error(this.message.MAX_5MB_ALLOWED);
			return false;
		}
		const URL = window.URL || window.webkitURL;
		const Img = new Image();
		const filesToUpload = fileInput.target.files;
		Img.src = URL.createObjectURL(filesToUpload[0]);
		Img.onload = (e: any) => {
			var path = e.path || (e.composedPath && e.composedPath());
			this.readURL(file);
			this.selectedAttachment = file;
			this.uploadAttachment = $event;
			this.uploadAttachmentCall();
		};
	}

	/**
	 * @description: used to view attachment preview of file
	 * @param file 
	 */
	readURL(file) {
		const fileReader: FileReader = new FileReader();
		fileReader.readAsDataURL(file);
		fileReader.onload = (event: ProgressEvent<FileReader>) => {
			this.attachmentPreview = event.target.result;
		};
	}

	/**
	 * @description: used to call upload attachment to server api
	 */
	uploadAttachmentCall() {
		this.uploadAttachmentToServer(this.uploadAttachment);
		this.uploadAttachment = "";
	}

	/**
	 * @description: used to upload attachment to server
	 * @param $event 
	 */
	uploadAttachmentToServer($event) {
		if (!this.selectedAttachment) {
			this.toastrService.error(this.message.UPLOAD_AGAIN);
			return;
		}
		let fd = new FormData();
		this.loaderService.show();

		fd.append("file", this.selectedAttachment);
		let env = environment.baseURL;
		fd.append("backendUrl", env)
		this.shoutOutService.uploadAttachment(fd).subscribe(
			(resp: any) => {
				this.loaderService.hide();
				if (resp.error) {
					this.attachmentPreview = "";
					this.reportIssueForm.patchValue({
						attachments: null,
					});
					this.selectedAttachment = "";
					this.toastrService.error(resp.message || this.message.SERVER_ERROR, this.message.ERROR);
				} else {
					this.uploadAttachmentUrl = resp.url;
					this.isAttachment = true;
					this.toastrService.success(this.message.UPLOADED_SUCCESSFULLY);
				}
			},
			(error) => {
				this.attachmentPreview = "";
				this.reportIssueForm.patchValue({
					attachments: null,
				});

				this.selectedAttachment = "";
				this.toastrService.error(this.message.UPLOAD_AGAIN || this.message.SERVER_ERROR);
				this.loaderService.hide();
			}
		);
	}

	/**
	 * @description: used to delete uploaded attachment
	 */
	deleteAttachment() {
		this.attachmentPreview = "";
		this.reportIssueForm.patchValue({
			attachments: null
		});
		this.selectedAttachment = "";
		this.uploadAttachmentUrl = "";
	}

	/**
	 * @description: used to submit report issue data 
	 */
	submitRequest() {
		if (this.reportIssueForm.invalid) {
			this.reportIssueForm.markAllAsTouched();
			return;
		}
		console.log(this.uploadAttachmentUrl, "this.uploadAttachmentUrl")
		let dataToSend: any = {
			description: this.description.value,
			taskLogId: this.taskLogId
		}
		if (this.isAttachment) {
			dataToSend.attachments = this.uploadAttachmentUrl
		}
		if (this.actionTimestampsId) {
			dataToSend.taskLogTimeStampId = this.actionTimestampsId;
		}
		console.log(dataToSend, '----------------------data to send--------------------------')
		this.loaderService.show();
		this.shoutOutService.raiseReport(dataToSend).subscribe(
			(resp) => {
				this.loaderService.hide();
				if (resp.error) {
					this.toastrService.error(resp.message || this.message.SOMETHING_WRONG, this.message.ERROR, { timeOut: 3000, });
				} else {
					this.toastrService.success(this.message.REPORT_RAISED_SUCCESS, this.message.SUCCESS, { timeOut: 3000 });
					this.modalService.dismissAll();
					this.getActivityList.emit(true);
					window.location.reload();
				}
			},
			(err) => {
				this.loaderService.hide();
				this.toastrService.error(err.error.message || this.message.SOMETHING_WRONG, this.message.ERROR, { timeOut: 3000 });
			}
		);
	}
}
