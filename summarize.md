2023/11/22 晚
初始化了前端项目
Q1、如何自动生成接口和实体类？
  在config/config.ts中的openApi修改接口文档地址（knif4j）
  在package.json中执行openapi命令，即可自动生成

Q2、登录成功但无法跳转
  app.tsx中的getInitialState方法会在页面首次被加载时执行
  此时获取登录用户信息并把它存储在state全局变量中，需要在typing.d.ts中新建InitialState接口实现loginUser
  我的猜测是有一个全局处理器会判断用户信息并决定是否跳转，但很可惜的是我没找到在哪

Q3、如何设计页面？
  在TableList下的index.tsx中使用官方的组件
  在columns中提供字段列表，字段值需要去pages.ts中设置
  在ProTable中为request提供参数，这里是执行方法的返回值，不能直接返回，需要结合request本身的参数进行对应
