<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useUserStore } from "./stores";

onLaunch(async (options) => {
    const userStore = useUserStore();

    userStore.mobile = '15035371904';
    // if (options && options.referrerInfo && options.referrerInfo.extraData && options.referrerInfo.extraData.mobile) {
    //     userStore.mobile = options.referrerInfo.extraData.mobile;
    // }
});

onShow(() => {

});

onHide(() => {

});
</script>
<style lang="scss">
.zp-l-text-rpx {
    font-size: 26rpx !important;
}

.back-top {
    bottom: calc(20rpx + var(--window-bottom)) !important;
}
</style>