import {PageContainer} from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import { useParams} from "@@/exports";
import {Button, Card, Descriptions, DescriptionsProps, message} from "antd";
import {getInterfaceInfoByIdUsingGet} from "@/services/pjh_api_backend/interfaceInfoController";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>();
  const params = useParams();

  const loadData = async () => {
    const hide = message.loading('正在获取数据');
    if(!params){
      message.error('该详情页不存在!');
      return ;
    }
    setLoading(true);
    try {
      const res = await getInterfaceInfoByIdUsingGet({
        id:parseInt(params.id, 10)
      });
      hide();
      message.success('获取成功!');
      setData(res.data);
    } catch (error) {
      hide();
      message.error('获取失败,' + error.message);
      return false;
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [])

  /**
   * createTime?: string;
   *     description?: string;
   *     id?: string;
   *     isDelete?: number;
   *     method?: string;
   *     name?: string;
   *     requestHeader?: string;
   *     responseHeader?: string;
   *     status?: number;
   *     updateTime?: string;
   *     url?: string;
   *     userId?: string;
   */
  const items: DescriptionsProps['items'] = [
    {
      key: '2',
      label: '接口地址',
      children: data?.url,
    },
    {
      key: '3',
      label: '接口简介',
      children: data?.description,
    },
    {
      key: '9',
      label: '状态',
      children: data?.status === 1 ? '可用' : data?.status === 0 ? '禁用' : '未知状态',
    },
    {
      key: '4',
      label: '调用方式',
      children: data?.method,
    },
    {
      key: '5',
      label: '请求头',
      span: 2,
      children: data?.requestHeader !== undefined && data?.requestHeader !== '' ? data?.requestHeader : '无请求头',
    },
    {
      key: '6',
      label: '响应头',
      children: data?.responseHeader !== undefined && data?.responseHeader !== '' ? data?.responseHeader : '无响应头',
    },
    {
      key: '7',
      label: '创建时间',
      children: data?.createTime,
    },
    {
      key: '8',
      label: '上次更新',
      children: data?.updateTime,
    },
  ];
  return (
    <PageContainer title={"查看接口详情"}>
      <Card  bordered={false} style={{ width: 1000 }}>
        <Descriptions title={data?.name} items={items} column={1}
        extra={<Button type="primary">调用接口</Button>}/>
      </Card>
    </PageContainer>
  );
};

export default Index;
