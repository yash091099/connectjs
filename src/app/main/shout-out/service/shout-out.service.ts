import { Injectable } from '@angular/core';
import { HttpencapService } from 'src/app/shared/services';
@Injectable({
	providedIn: 'root'
})
export class ShoutOutService {

	constructor(private http: HttpencapService) { }

	getLeaderShipBoardListing(data?) {
		return this.http.get('auth/v1/users/shoutout/leadership', data);
	}
	hideLeaderName(data) {
		return this.http.patch('auth/v1/update/hidden/status', data);
	}

	grantRewardAfterWatchComplete(data?) {
		return this.http.post('shoutoutTransactions/v1/user/add/token/wallet', data);
	}
	
	newUpdateTask(data){
		return this.http.patch('auth/v1/user/update/email/updates', data);
        
	}


	getCampaigns(data?) {
		return this.http.get('shoutoutCampaigns/v1/all/ongoing', data);
	}

	startEarning(data) {
		return this.http.post('shoutoutTransactions/v1/user/add/token/wallet', data);
	}

	loginWithTelegram(data) {
		return this.http.patch('social/v1/add/details/telegram', data);
	}

	checkRewardAvailable(data) {
		return this.http.get('shoutoutCampaigns/v1/get/shoutout/campaign/reward', data);
	}

	insertActionLog(data) {
		return this.http.post('taskLogs/v1/insert ', data);
	}

	getSocialConnection() {
		return this.http.get('social/v1/get');
	}

	getCompletedCampaigns(data) {
		return this.http.get('shoutoutCampaigns/v1/completed', data);
	}

	getActivityLogs(data) {
		return this.http.get('taskLogs/v1/user/list', data)
	}

	raiseReport(data?) {
		return this.http.post('complaints/v1/insert', data);
	}

	uploadAttachment(data?) {
		return this.http.put('uploads/v1/file', data);
	}

	verifyTask(data) {
		return this.http.post('shoutoutTransactions/v1/user/twitter/re/verify/task', data);
	}

	getLoggedUserRank() {
		return this.http.get('auth/v1/user/shoutout/rank');
	}
	getTotalTaskReward() {
		return this.http.get('shoutoutTransactions/v1/user/earnings');
	}

	getUpcomingCompititions() {
		return this.http.get('shoutoutProject/v1/all/pagination');
	}

	getCampaignsByProjectId(data) {
		return this.http.get('shoutoutCampaigns/v1/for/project', data);
	}
	getProjectById(data) {
		return this.http.get('shoutoutProject/v1/details/for/user', data);
	}
	getCampaignDetailsById(id){
		return this.http.get('shoutoutCampaigns/v1/shoutout/campaign/'+id);
	}

	getAllProjectsForLeaderboard() {
		return this.http.get('shoutoutProject/v1/get/leaderboard/project');
	}

	getLeadershipDetailsByProjectId(data) {
		return this.http.get('shoutoutProject/v1/project/leaderboard', data);
	}
	getUsersCompletedTasks(){
		return this.http.get('shoutoutProject/v1/get/user/projects/completed/tasks')
	}

	markEngagementTaskCompleted(data) {
		return this.http.patch('shoutoutTransactions/v1/mark/task/complete',data);
		// return this.http.patch('shoutoutTransactions/v1/mark/task/complete',data);
	}
	performTaskWithSecondApp(data) {
		return this.http.get('', data);
	}

}
