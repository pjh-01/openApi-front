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

2023/11/23 晚
把新增接口和修改接口写好了
Q1、怎么写这些接口的页面
  1、在src/pages/InterfaceInfoList/components中新建组件，在里面引入ProTable
  2、在index.tsx中修改columns（表单的字段）,引入1中的组件，修改对应的后端接口调用方法

2023/11/27 晚
Q1、为什么点击了修改、发布、下线等任意一按钮后，按钮们会复制？（即越按越多）
  这是因为react并没有真正地去维护一颗DOM树，而是采用map的方法，为每一个元素绑定一个key来标识
  因为我们的按钮key都是一样的，点击后react不确定dom到底发生什么变化了，可能导致按钮重复渲染

2023/12/5 下午
Q1、怎么添加分页？
  添加Pagination属性，最重要的是写好onChange方法，这是跳转页面的执行函数，总的来说，最外面都会包裹PageContainer
  此外，React中的useEffect 是 React 中的一个 Hook，用于处理副作用，可以用来第一次加载时初始化页面
  useState也是一个Hook，第一个参数（a）是变量，第二个（setA）是监听器，当使用setA时，react会自动重新加载a

Q2、 怎么添加接口文档页？
  使用Card和Description组件

Q3、怎么设计动态路由？
  使用/path/:id
  使用字符串解析模板，`/interfaceInfo/${item.id}`
  可以通过useParams直接获取:id，然后取param.id
