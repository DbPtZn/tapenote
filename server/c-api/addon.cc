// addon.cc
#include <node_api.h>

napi_value SayHello(napi_env env, napi_callback_info info) {
  napi_value greeting;
  napi_status status;

  status = napi_create_string_utf8(env, "Hello from N-API!", NAPI_AUTO_LENGTH, &greeting);
  if (status != napi_ok) return nullptr;

  return greeting;
}

napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_value fn;

  status = napi_create_function(env, nullptr, 0, SayHello, nullptr, &fn);
  if (status != napi_ok) return nullptr;

  status = napi_set_named_property(env, exports, "sayHello", fn);
  if (status != napi_ok) return nullptr;

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)