import {PageContainer} from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import {useParams} from "@@/exports";
import {Button, Card, Descriptions, DescriptionsProps, Form, Input, message, Space,Image} from "antd";
import {
  getInterfaceInfoByIdUsingGet,
  invokeInterfaceInfoUsingPost
} from "@/services/pjh_api_backend/interfaceInfoController";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>();
  const [invokeRes, setInvokeRes] = useState<any>();
  const [invokeLoading, setInvokeLoading] = useState(false);
  const params = useParams();

  const loadData = async () => {
    const hide = message.loading('正在获取数据');
    if (!params) {
      message.error('该详情页不存在!');
      return;
    }
    setLoading(true);
    try {
      const res = await getInterfaceInfoByIdUsingGet({
        id: parseInt(params.id, 10)
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

  const onFinish = async (values: any) => {
    if (!params.id) {
      message.error('接口不存在');
      return;
    }
    setInvokeLoading(true);
    try {
      const res = await invokeInterfaceInfoUsingPost({
        id: params.id,
        ...values,
      });
      setInvokeRes(res.data);
      message.success('请求成功');
    } catch (error: any) {
      message.error('操作失败，' + error.message);
    }
    setInvokeLoading(false);
  };

  // 根据文件后缀判断是否是图片
  const isImage = (fileName:string) => {
    if (!fileName) {
      return false; // 如果 fileName 为 undefined 或 null，不是图片
    }
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp']; // 常见图片后缀
    return imageExtensions.some(ext => fileName.endsWith(ext));
  };


  return (
    <PageContainer title={"查看接口详情"}>
      <Space direction="vertical" size="middle" style={{display: 'flex'}}>
        <Card bordered={false} style={{width: 1000}}>
          <Descriptions title={data?.name} items={items} column={1}/>
        </Card>
        <Card style={{width: 1000}}>
          <Form name="invoke" layout="vertical" onFinish={onFinish} style={{ maxWidth: 1000 }}>
            <Form.Item label="请求参数" name="userRequestParams">
              <Input.TextArea/>
            </Form.Item>
            <Form.Item wrapperCol={{span: 16}}>
              <Button type="primary" htmlType="submit">
                调用
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <Card title="返回结果" loading={invokeLoading} style={{width: 1000}}>
          {isImage(invokeRes) ? (
            <Image width={900} src={invokeRes} alt="Image" />
          ) : (
            invokeRes
          )}
        </Card>
      </Space>
    </PageContainer>
  );
};

export default Index;
