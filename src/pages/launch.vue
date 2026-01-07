<template>
	<view class="invitation-code">
		<up-navbar bgColor="inherit" :fixed="false" leftIcon="" :autoBack="false">
			<template #center>
				<text class="up-navbar-title">达人中心</text>
			</template>
			<template #right>
				<CapsuleButton />
			</template>
		</up-navbar>
		<view class="loading-icon" v-if="isLoading">
			<up-loading-icon size="20"></up-loading-icon>
		</view>
		<view class="invitation-code-box" v-else>
			<view class="code-box">
				<image src="@/static/images/code-title.png" mode="widthFix" style="width: 500rpx;" />
				<image src="@/static/images/code-img.png" mode="widthFix" style="width: 260rpx;margin-top: 30rpx;" />
				<view class="input-box">
					<input class="input" v-model="invitationCode" placeholder="请输入邀请码"></input>
				</view>
				<view class="submit-button" @click="submit">
					校验
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores';
import { apiSensitive, apiUserLogin, apiVerifyInvitationCode } from '@/api/user';

import CapsuleButton from '@/components/capsule-button.vue';

const { token, userInfo } = toRefs(useUserStore());
const isLoading = ref(true);
const mobile = ref<string>('');
const invitationCode = ref<string>('');

const getUserInfo = async () => {
	var params = {
		platform: "app",
		mobile: mobile.value
	}
	const res = await apiUserLogin(params);
	if (res && res.is_new == 0) {
		token.value = res.token.AccessToken;
		userInfo.value = await apiSensitive();
		/*#ifdef APP-PLUS*/
		plus.navigator.closeSplashscreen();
		/*#endif*/
		uni.reLaunch({ url: '/pages/index' });
	}
	else {
		isLoading.value = false;
		/*#ifdef APP-PLUS*/
		plus.navigator.closeSplashscreen();
		/*#endif*/
	}
};

//提交邀请码
const submit = async () => {
	if (!invitationCode.value || invitationCode.value.trim() === '') {
		uni.showToast({ title: '请输入邀请码', icon: 'none' });
		return;
	}

	var params = {
		mobile: mobile.value,
		invitation_code: invitationCode.value
	}
	const res = await apiVerifyInvitationCode(params);
	if (res && res.token) {
		uni.showToast(
			{
				title: '验证成功',
				icon: 'success',
				duration: 2000,
				complete: () => {
					setTimeout(async () => {
						token.value = res.token.AccessToken;
						userInfo.value = await apiSensitive();
						uni.reLaunch({ url: '/pages/index' });
					}, 2000);
				}
			}
		);
	}
}

onLoad((e: any) => {
	token.value = '';
	userInfo.value = null;
	mobile.value = "15848936485";
	getUserInfo();
	if (e && e.mobile) {
		mobile.value = e.mobile;
		getUserInfo();
	}
});
</script>

<style lang="scss" scoped>
.loading-icon {
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
}

.invitation-code {
	width: 100%;
	height: 100vh;
	background-image: url('@/static/images/bg1.png');
	background-size: 100% auto;
	background-repeat: no-repeat;
	overflow: hidden;
	display: flex;
	flex-flow: column;

	.invitation-code-box {
		flex: 1;
		display: flex;
		justify-content: center;
	}

	.code-box {
		width: 500rpx;
		margin-top: 300rpx;
		display: flex;
		flex-flow: column;
		align-items: center;

	}

	.title {
		width: 100%;
		text-align: center;
		font-size: 32rpx;
		color: #333;
		font-weight: 700;

		color: #ff5730;
		text-shadow: 0 2px 2px #c9a99640;
		-webkit-text-stroke-width: 1.5px;
		-webkit-text-stroke-color: #FFF;
	}

	.input-box {
		width: 100%;
		margin-top: 30rpx;

		.input {
			height: 78rpx;
			border-radius: 78rpx;
			border: 1rpx solid #ff5730;
			padding: 0 20rpx;
			font-size: 28rpx;
			text-align: center;
		}
	}

	.submit-button {
		width: 100%;
		height: 78rpx;
		line-height: 78rpx;
		border-radius: 78rpx;
		margin-top: 30rpx;
		text-align: center;
		font-size: 28rpx;
		color: #ffffff;
		border: 1rpx solid #ff5730;
		background: #FF5730;
	}
}
</style>