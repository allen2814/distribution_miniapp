type FlutterBridgeParams = Record<string, unknown>;

declare global {
    interface Window {
        BunnyuFlutterChannel?: {
            postMessage: (message: string) => void;
        };
        navigateToPage?: (route: string, params?: FlutterBridgeParams) => void;
    }
}

/**
 * H5 与 wgt 使用同一套消息体：
 * { action, params }
 *
 * H5：BunnyuFlutterChannel.postMessage(JSON.stringify(...))
 * wgt：uni.sendNativeEvent(event, data, callback)
 */
function sendToFlutter(action: string, params: FlutterBridgeParams = {}): boolean {
    const message = { action, params };

    // H5 WebView（Flutter 注入的 channel）
    try {
        if (typeof window !== 'undefined' && window.BunnyuFlutterChannel?.postMessage) {
            window.BunnyuFlutterChannel.postMessage(JSON.stringify(message));
            return true;
        }
    } catch (e) {
        console.warn('[flutter-bridge] H5 postMessage failed', e);
    }

    // App 内 uni 小程序（wgt）—— 与 H5 相同结构发给宿主
    try {
        const sendNativeEvent = (uni as any).sendNativeEvent;
        if (typeof sendNativeEvent === 'function') {
            // 第 2 个参数与 H5 的 JSON 体一致，方便 App 端复用同一套解析
            sendNativeEvent(action, message, (ret: unknown) => {
                console.log('[flutter-bridge] native callback', ret);
            });
            return true;
        }
    } catch (e) {
        console.warn('[flutter-bridge] sendNativeEvent failed', e);
    }

    console.warn('[flutter-bridge] 当前环境无法与 Flutter 宿主通信');
    return false;
}

/** 跳转到 Flutter App 原生页面 */
export function navigateToFlutterPage(route: string, args: FlutterBridgeParams = {}): boolean {
    return sendToFlutter('navigate', {
        route,
        arguments: args,
    });
}

/** 返回 Flutter App 首页 */
export function backToFlutterHome(): boolean {
    return sendToFlutter('backToHome');
}
