import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns, ProDescriptionsItemProps} from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import {FormattedMessage, useIntl} from '@umijs/max';
import {Button, Drawer, message} from 'antd';
import React, {useRef, useState} from 'react';
import UpdateForm from './components/UpdateForm';
import {
  addInterfaceInfoUsingPost,
  deleteInterfaceInfoUsingPost,
  listInterfaceInfoByPageUsingPost,
  offlineInterfaceInfoUsingPost,
  onlineInterfaceInfoUsingPost,
  updateInterfaceInfoUsingPost
} from "@/services/pjh_api_backend/interfaceInfoController";
import CreateForm from "@/pages/Admin/InterfaceInfoList/components/CreateForm";


const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  /**
   * @en-US Add node
   * @zh-CN 添加接口
   * @param fields
   */
  const handleAdd = async (fields: API.InterfaceInfo) => {
    const hide = message.loading('正在添加');
    try {
      await addInterfaceInfoUsingPost({...fields});
      hide();
      message.success('新建成功!');
      handleModalOpen(false);
      return true;
    } catch (error) {
      hide();
      message.error('新建失败,' + error.message);
      return false;
    }
  };

  /**
   * @en-US Update node
   * @zh-CN 更新接口
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.InterfaceInfo) => {
    if (!currentRow) {
      return;
    }
    const hide = message.loading('少女祈愿中...');
    try {
      await updateInterfaceInfoUsingPost({
        id: currentRow.id,
        ...fields
      });
      hide();

      message.success('修改成功!');
      return true;
    } catch (error) {
      hide();
      message.error('修改失败,' + error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除接口
   *
   * @param record
   */
  const handleRemove = async (record: API.InterfaceInfo) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      await deleteInterfaceInfoUsingPost({
        id: record.id
      });
      hide();
      message.success('删除成功!');
      actionRef.current?.reload();
      return true;
    } catch (error) {
      hide();
      message.error('删除失败,'+error.message);
      return false;
    }
  };

  /**
   *  Online node
   * @zh-CN 发布接口
   *
   * @param record
   */
  const handleOnline = async (record: API.InterfaceInfo) => {
    const hide = message.loading('正在发布');
    if (!record) return true;
    try {
      await onlineInterfaceInfoUsingPost({
        id: record.id
      });
      hide();
      message.success('发布成功!');
      actionRef.current?.reload();
      return true;
    } catch (error) {
      hide();
      message.error('发布失败,'+error.message);
      return false;
    }
  };

  /**
   *  Online node
   * @zh-CN 发布接口
   *
   * @param record
   */
  const handleOffline = async (record: API.InterfaceInfo) => {
    const hide = message.loading('正在下线');
    if (!record) return true;
    try {
      await offlineInterfaceInfoUsingPost({
        id: record.id
      });
      hide();
      message.success('下线成功!');
      actionRef.current?.reload();
      return true;
    } catch (error) {
      hide();
      message.error('下线失败,'+error.message);
      return false;
    }
  };

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: <FormattedMessage id="pages.searchTable.id" defaultMessage="ID"/>,
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.updateForm.ruleName.nameLabel"
          defaultMessage="Rule name"
        />
      ),
      dataIndex: 'name',
      formItemProps: {
        rules: [{
          required: true,
          message: "接口名称不能为空!"
        }]
      },
      tip: 'The rule name is the unique key',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleDesc" defaultMessage="Description"/>,
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.searchTable.url" defaultMessage="URL"/>,
      dataIndex: 'url',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="pages.searchTable.method" defaultMessage="method"/>,
      dataIndex: 'method',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="pages.searchTable.params" defaultMessage="params"/>,
      dataIndex: 'params',
      valueType: 'jsonCode',
    },
    {
      title: <FormattedMessage id="pages.searchTable.requestHeader" defaultMessage="requestHeader"/>,
      dataIndex: 'requestHeader',
      valueType: 'jsonCode',
    },
    {
      title: <FormattedMessage id="pages.searchTable.responseHeader" defaultMessage="responseHeader"/>,
      dataIndex: 'responseHeader',
      valueType: 'jsonCode',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleStatus" defaultMessage="Status"/>,
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: (
            <FormattedMessage
              id="pages.searchTable.nameStatus.default"
              defaultMessage="Shut down"
            />
          ),
          status: 'Default',
        },
        1: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.running" defaultMessage="Running"/>
          ),
          status: 'Processing',
        },
        2: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.online" defaultMessage="Online"/>
          ),
          status: 'Success',
        },
        3: {
          text: (
            <FormattedMessage
              id="pages.searchTable.nameStatus.abnormal"
              defaultMessage="Abnormal"
            />
          ),
          status: 'Error',
        },
      },
    },
    // {
    //   title: (
    //     <FormattedMessage
    //       id="pages.searchTable.titleUpdatedAt"
    //       defaultMessage="Last scheduled time"
    //     />
    //   ),
    //   sorter: true,
    //   dataIndex: 'updatedAt',
    //   valueType: 'dateTime',
    //   renderFormItem: (item, {defaultRender, ...rest}, form) => {
    //     const status = form.getFieldValue('status');
    //     if (`${status}` === '0') {
    //       return false;
    //     }
    //     if (`${status}` === '3') {
    //       return (
    //         <Input
    //           {...rest}
    //           placeholder={intl.formatMessage({
    //             id: 'pages.searchTable.exception',
    //             defaultMessage: 'Please enter the reason for the exception!',
    //           })}
    //         />
    //       );
    //     }
    //     return defaultRender(item);
    //   },
    // },
    {
      title: '创建时间',
      key: 'since',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true
    },
    {
      title: '更新时间',
      key: 'since',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInForm: true
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating"/>,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config1"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.update" defaultMessage="Update"/>
        </a>,
        record.status===0?<a
          key="config2"
          onClick={() => {
            handleOnline(record)
          }}
        >
          <FormattedMessage id="pages.searchTable.online" defaultMessage="Online"/>
        </a>:null,
        record.status===1?<a
          key="config3"
          onClick={() => {
            handleOffline(record)
          }}
        >
          <FormattedMessage id="pages.searchTable.offline" defaultMessage="Offline"/>
        </a>:null,
        <Button
          type={"text"}
          danger={true}
          key="config4"
          onClick={() => {
            handleRemove(record)
          }}
        >
          <FormattedMessage id="pages.searchTable.delete" defaultMessage="Delete"/>
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined/> <FormattedMessage id="pages.searchTable.new" defaultMessage="New"/>
          </Button>,
        ]}
        request={async (params: null) => {
          const res = await listInterfaceInfoByPageUsingPost({
            ...params
          })
          if (res?.data) {
            return {
              data: res?.data.records || [],
              success: true,
              total: res.data.total
            }
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen"/>{' '}
              <a style={{fontWeight: 600}}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项"/>
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万"/>
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.newRule',
          defaultMessage: 'New rule',
        })}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.RuleListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.ruleName"
                  defaultMessage="Rule name is required"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc"/>
      </ModalForm>
      <UpdateForm
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        values={currentRow || {}}
        visible={updateModalOpen}/>

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
      <CreateForm columns={columns} onCancel={() => {
        handleModalOpen(false)
      }}
                  onSubmit={(values) => {
                    handleAdd(values)
                  }} visible={createModalOpen}></CreateForm>
    </PageContainer>
  );
};

export default TableList;
