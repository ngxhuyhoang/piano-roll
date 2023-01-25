#import <React/RCTBridgeModule.h>

/**
 * This is the bridge between the native code and the JavaScript code.
 * The JavaScript code will call the methods defined here.
 *
 * @Params
 * PianoPlayerModule: The name of the module that will be used in the JavaScript code.
 * PianoPlayerManager: The Swift Class Module Manager.
 */

/**
 * PianoPlayerManager.h
 *
 * This is a module for PianoPlayerManager. It is responsible for initializing the native
 * PianoPlayerManager object and exposing methods for controlling the native PianoPlayerManager
 * object.
 *
 * PianoPlayerManager is a native singleton that manages a single PianoPlayer object. It
 * is responsible for initializing the PianoPlayer and exposing methods for controlling
 * the PianoPlayer.
 */

@interface RCT_EXTERN_REMAP_MODULE(PianoPlayerModule, PianoPlayerManager, NSObject)

RCT_EXTERN_METHOD(play:(NSArray *)notes tempo:(nonnull NSNumber *)tempo resolve:(RCTPromiseResolveBlock *)resolve reject:(RCTPromiseRejectBlock *)reject);
RCT_EXTERN_METHOD(stop);

@end
