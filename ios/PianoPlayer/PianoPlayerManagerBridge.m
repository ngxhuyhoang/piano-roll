#import <React/RCTBridgeModule.h>

/**
 * This is the bridge between the native code and the JavaScript code.
 * The JavaScript code will call the methods defined here.
 *
 * @Params
 * PianoPlayerModule: The name of the module that will be used in the JavaScript code.
 * PianoPlayerManager: The Swift Class Module Manager.
 */
@interface RCT_EXTERN_REMAP_MODULE(PianoPlayerModule, PianoPlayerManager, NSObject)

RCT_EXTERN_METHOD(play:(NSArray *)notes tempo:(nonnull NSNumber *)tempo resolve:(RCTPromiseResolveBlock *)resolve reject:(RCTPromiseRejectBlock *)reject);
RCT_EXTERN_METHOD(stop);

@end
