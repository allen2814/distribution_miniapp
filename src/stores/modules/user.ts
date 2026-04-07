import { ref } from "vue";
import { defineStore } from "pinia";
import type { UserModel } from "@/api/user/models";

export const useUserStore = defineStore("user", () => {
	const token = ref<string>('');
	const mobile = ref<string>('');
	const userInfo = ref<UserModel | null>(null);

	return {
		token,
		mobile,
		userInfo,
	}
}, {
	persist: {
		enabled: true,
		strategies: [
			{
				key: 'user',
				storage: localStorage,
				paths: ['token', 'userInfo']
			}
		]
	}
});