import {PageContainer} from '@ant-design/pro-components';
import {List, message, Pagination} from 'antd';
import React, {useEffect, useState} from 'react';
import {
  listInterfaceInfoByPageUsingPost,
} from "@/services/pjh_api_backend/interfaceInfoController";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<API.InterfaceInfo[]>([]);
  const [total, setTotal] = useState<number>(0);

  const loadData = async (current = 1, pageSize = 10) => {
    const hide = message.loading('正在获取数据');
    setLoading(true);
    try {
      const res = await listInterfaceInfoByPageUsingPost({
        current, pageSize
      });
      hide();
      message.success('获取成功!');
      setList(res?.data?.records ?? []);
      setTotal(res?.data?.total ?? 0);
    } catch (error) {
      hide();
      message.error('获取失败,' + error.message);
      return false;
    }
    setLoading(false);
  };

  /**
   * useEffect 是 React 中的一个 Hook，用于处理副作用。
   * 副作用通常指的是在组件渲染过程中，
   * 执行那些不直接与渲染 UI 相关的操作，比如数据获取、订阅或手动操作 DOM 等。
   *
   * 第一个参数是一个函数： 这个函数包含了你要在组件渲染时执行的副作用代码。
   *
   * 第二个参数是一个数组： 这个数组指定了该 useEffect 依赖的变量。当这些变量的值发生变化时，React 将重新运行 useEffect。
   * 如果传递的是一个空数组 []，则表示该 useEffect 不依赖于任何变量，它只在组件第一次渲染时运行。
   */
  useEffect(() => {
    loadData();
  }, [])

  return (
    <PageContainer title={"在线接口开放平台"}>
      <List
        className="my-list"
        loading={loading}
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => {
          const apiLink = `/interfaceInfo/${item.id}`;
          return <List.Item
            actions={[<a key={item.id} href={apiLink}>详情</a>]}
          >
            <List.Item.Meta
              title={<a href={apiLink}>{item.name}</a>}
              description={item.description}
            />
          </List.Item>
        }}
      />
      <Pagination
        total={total}
        showTotal={(total, range)=>{
          return '总数'+total;
        }}
        onChange={(page, pageSize) => {
        loadData(page,pageSize)
      }}
      />
    </PageContainer>
  );
};

export default Index;
