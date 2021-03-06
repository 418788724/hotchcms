import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './components/List'
import Filter from './components/Filter'
import Modal from './components/Modal'

const AdminUser = ({
  location, dispatch, adminUser, loading,
}) => {
  const { query, pathname } = location
  const {
    list, pagination, currentItem, groupList, modalVisible, modalType, selectedRowKeys,
  } = adminUser

  const handleRefresh = (newQuery) => {
    dispatch(routerRedux.push({
      pathname,
      search: queryString.stringify({
        ...query,
        ...newQuery,
      }),
    }))
  }

  const modalProps = {
    modalType,
    item: modalType === 'create' ? {} : currentItem,
    groupList,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`adminUser/${modalType}`],
    title: `${modalType === 'create' ? ' 创建' : '更新'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `adminUser/${modalType}`,
        payload: data,
      })
        .then(() => {
          handleRefresh()
        })
    },
    onCancel () {
      dispatch({
        type: 'adminUser/hideModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['adminUser/query'],
    pagination,
    location,
    onChange (page) {
      handleRefresh({
        page: page.current,
        pageSize: page.pageSize,
      })
    },
    onDeleteItem (id) {
      dispatch({
        type: 'adminUser/delete',
        payload: id,
      })
        .then(() => {
          handleRefresh({
            page: (list.length === 1 && pagination.current > 1) ? pagination.current - 1 : pagination.current,
          })
        })
    },
    onEditItem (item) {
      dispatch({
        type: 'adminUser/queryGroup',
      })
        .then(() => {
          dispatch({
            type: 'adminUser/showModal',
            payload: {
              modalType: 'update',
              currentItem: item,
            },
          })
        })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'adminUser/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
  }

  const filterProps = {
    filter: {
      ...query,
    },
    onFilterChange (value) {
      handleRefresh({
        ...value,
        page: 1,
      })
    },
    onAdd () {
      dispatch({
        type: 'adminUser/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'adminUser/multiDelete',
      payload: {
        multi: selectedRowKeys,
      },
    })
      .then(() => {
        handleRefresh({
          page: (list.length === selectedRowKeys.length && pagination.current > 1) ? pagination.current - 1 : pagination.current,
        })
      })
  }

  return (
    <Page inner>
      <Filter {...filterProps} />
      {
        selectedRowKeys.length > 0 &&
        <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
          <Col>
            {`选中 ${selectedRowKeys.length} 目标 `}
            <Popconfirm title={'确定删除这些目标?'} placement="left" onConfirm={handleDeleteItems}>
               <Button type="danger" size="large" style={{ marginLeft: 8 }}>删除</Button>
             </Popconfirm>
          </Col>
        </Row>
      }
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </Page>
  )
}

AdminUser.propTypes = {
  adminUser: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ adminUser, loading }) => ({ adminUser, loading }))(AdminUser)
