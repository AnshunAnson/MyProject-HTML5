# 前端控制UE内部功能方案

## 1. 项目现状分析

当前项目是一个 **Unreal Engine 4.27 HTML5** 项目,使用 Emscripten 编译为 WebAssembly 运行在浏览器中。

关键文件:

* `index.html` - 主HTML页面,包含加载UI

* `H5.html` - UE原始HTML模板

* `H5.UE4.js` - UE4的JavaScript集成层

* `Utility.js` - 工具函数库

***

## 2. 技术栈选择

### 2.1 核心通信层

| 层级        | 技术/库                              | 用途                   |
| --------- | --------------------------------- | -------------------- |
| **底层通信**  | Emscripten `cwrap`/`ccall`        | JavaScript ↔ C++ 互操作 |
| **数据序列化** | JSON (标准)                         | 结构化数据传递              |
| **二进制数据** | TypedArray + Module.HEAP          | 高性能大数据传输             |
| **内存管理**  | `Module._malloc` / `Module._free` | 手动内存管理               |

### 2.2 接口管理层技术栈推荐

#### 推荐方案: TypeScript + 事件驱动架构

```
┌─────────────────────────────────────────────────────────────┐
│                      前端应用层 (UI)                        │
│  React/Vue/原生JS - 按钮、表单、状态显示                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│            UEBridge - 接口管理层 (TypeScript)               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 1. API Registry - 接口注册表                          │ │
│  │ 2. Event Bus - 事件总线                               │ │
│  │ 3. Type Safety - TypeScript类型定义                  │ │
│  │ 4. Middleware - 中间件(日志、重试、验证等)            │ │
│  └───────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│         Emscripten Wrapper - 底层通信层                      │
│  cwrap/ccall, 字符串编码, 内存管理                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    UE4 C++ 层                                │
│  暴露函数 + 事件回调                                        │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 接口管理核心组件

#### 组件1: API Registry (接口注册表)

```typescript
interface UEApiDefinition {
  name: string;
  returnType: 'void' | 'number' | 'string' | 'boolean';
  paramTypes: Array<'number' | 'string' | 'boolean'>;
  description?: string;
}

class UEApiRegistry {
  private registry = new Map<string, UEApiDefinition>();
  
  register(def: UEApiDefinition) { /* ... */ }
  get(name: string): UEApiDefinition | undefined { /* ... */ }
  list(): UEApiDefinition[] { /* ... */ }
}
```

#### 组件2: 类型安全的包装器

```typescript
// 自动生成的类型定义
type UECommandFn = (command: string, params: string) => void;
type UEGetStateFn = () => string;

// 类型安全的API访问
interface UEBridgeAPI {
  sendCommand: UECommandFn;
  getState: UEGetStateFn;
  // ... 更多API
}
```

#### 组件3: Event Bus (双向事件总线)

```typescript
// 前端 → UE
type UECommandEvent = {
  type: 'load_level' | 'set_speed' | 'trigger_event';
  payload: any;
};

// UE → 前端
type UENotificationEvent = {
  type: 'state_changed' | 'error' | 'log';
  payload: any;
};

class UEEventBus {
  on(event: string, handler: Function) { /* ... */ }
  emit(event: string, data: any) { /* ... */ }
  sendToUE(event: UECommandEvent) { /* ... */ }
}
```

#### 组件4: 中间件系统

```typescript
type Middleware = (context: ApiContext, next: () => any) => any;

const loggingMiddleware: Middleware = (ctx, next) => {
  console.log(`[UEBridge] Calling ${ctx.apiName}`, ctx.params);
  const result = next();
  console.log(`[UEBridge] Result:`, result);
  return result;
};

const errorHandlerMiddleware: Middleware = (ctx, next) => {
  try {
    return next();
  } catch (e) {
    console.error(`[UEBridge] Error in ${ctx.apiName}`, e);
    throw e;
  }
};
```

***

## 3. 前端控制UE的主要方式

### 3.1 Emscripten cwrap/ccall 机制 (核心方式)

这是UE4 HTML5提供的标准方式,通过 `Module.cwrap()` 将C++函数暴露给JavaScript调用。

**工作原理:**

```javascript
// 在UE C++代码中定义函数
extern "C" {
    EMSCRIPTEN_KEEPALIVE
    void MyFunction(int param) {
        // 你的UE逻辑
    }
}

// 在JavaScript中调用
const MyFunction = Module.cwrap('MyFunction', null, ['number']);
MyFunction(42);
```

### 3.2 实现方案概览

#### 方案A: 双向通信桥接

1. **UE → 前端**: 通过UE调用JS回调函数
2. **前端 → UE**: 通过cwrap调用暴露的C++函数

#### 方案B: 事件系统

建立统一的事件总线,支持命名事件和参数传递

***

## 4. 具体实现步骤

### 第一步: 修改UE项目的C++代码

1. 在UE项目中创建一个新的C++类或使用GameMode
2. 暴露需要被前端控制的函数
3. 添加接收前端消息的处理逻辑

**示例C++代码:**

```cpp
// 在项目中创建 WebBridge.h 和 WebBridge.cpp
#include "CoreMinimal.h"

extern "C" {
    // 暴露给JS的函数
    EMSCRIPTEN_KEEPALIVE
    void UE_SendCommand(const char* command, const char* params);
    
    EMSCRIPTEN_KEEPALIVE
    const char* UE_GetState();
}

// 在UE内部注册JS回调
DECLARE_DYNAMIC_DELEGATE_TwoParams(FOnUEEvent, FString, EventName, FString, EventData);
```

### 第二步: 创建JavaScript/TypeScript桥接层

在项目中创建 `UEBridge.ts/js`,包含:

1. 封装cwrap调用的函数
2. API Registry - 接口注册表
3. Event Bus - 事件总线
4. 中间件系统
5. 错误处理和日志记录

### 第三步: 集成到index.html

在index.html中:

1. 引入UEBridge.js
2. 添加控制UI元素(按钮、滑块等)
3. 绑定UI事件到桥接函数
4. 添加状态显示区域

### 第四步: 测试和调试

1. 重新打包UE项目为HTML5
2. 在浏览器中测试各种控制
3. 使用console调试通信

***

## 5. 文件修改计划

### 需要修改/新增的文件:

1. **新增** `HTML5/UEBridge.js` - JavaScript桥接层(含接口管理)
2. **修改** `HTML5/index.html` - 集成桥接和添加控制UI
3. **UE项目侧** - 添加C++暴露函数(需要在UE编辑器中完成)

***

## 6. 注意事项和风险

### 6.1 技术注意事项

* 字符串传递需要使用Module.UTF8ToString/stringToUTF8Array

* 内存管理: 使用Module.\_malloc和Module.\_free

* 异步调用: UE函数可能需要异步处理

* 线程安全: 注意UE的游戏线程

### 6.2 性能考虑

* 频繁调用会有性能开销,建议批量处理

* 大的数据传递使用内存缓冲区

* 考虑使用requestAnimationFrame同步

### 6.3 错误处理

* 添加try-catch包裹cwrap调用

* 提供合理的降级方案

* 日志记录所有通信

***

## 7. 功能示例

可以实现的控制功能:

* 加载不同关卡

* 控制游戏暂停/继续

* 调整游戏参数(速度、难度等)

* 触发游戏内事件

* 获取游戏状态信息

* 控制相机视角

* 发送控制台命令

***

## 8. 推荐的开发工具

* **TypeScript** - 类型安全,接口定义清晰

* **Zod** - 运行时数据验证

* **RxJS** (可选) - 复杂事件流处理

* **JSDoc** - 如果不使用TS,用于类型标注

***

## 9. 下一步行动

用户确认此计划后,我将:

1. 创建UEBridge.js桥接文件,包含完整的接口管理系统
2. 修改index.html添加示例UI
3. 提供完整的C++示例代码供在UE编辑器中集成
4. 编写使用文档

