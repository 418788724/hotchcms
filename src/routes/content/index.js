import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs, Icon } from 'antd'
import { routerRedux } from 'dva/router'
import lodash from 'lodash'
import List from './List'

const TabPane = Tabs.TabPane

const EnumPostStatus = {
  UNPUBLISH: 0,
  PUBLISHED: 1,
  DELETED: 2,
}

const queryActive = function (status) {
  let active = String(EnumPostStatus.PUBLISHED)
  lodash.forEach(EnumPostStatus, (value) => {
    if (String(value) === status) {
      active = String(value)
    }
  })
  return active
}

const Index = ({ post, dispatch, loading, location }) => {
  const { list, pagination } = post
  const { query = {}, pathname } = location

  const listProps = {
    pagination,
    dataSource: list,
    loading: loading.effects['post/query'],
    onChange (page) {
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
  }

  const handleTabClick = (key) => {
    dispatch(routerRedux.push({
      pathname,
      query: {
        status: key,
      },
    }))
  }


  return (<div className="content-inner">
    <Tabs activeKey={queryActive(query.status)} onTabClick={handleTabClick}>
      <TabPane tab={<span><Icon type="book" />已发布</span>} key={String(EnumPostStatus.PUBLISHED)}>
        <List {...listProps} />
      </TabPane>
      <TabPane tab={<span><Icon type="edit" />草稿</span>} key={String(EnumPostStatus.UNPUBLISH)}>
        <List {...listProps} />
      </TabPane>
      <TabPane tab={<span><Icon type="delete" />回收站</span>} key={String(EnumPostStatus.DELETED)}>
        <List {...listProps} />
      </TabPane>
    </Tabs>
  </div>)
}

Index.propTypes = {
  post: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ post, loading }) => ({ post, loading }))(Index)
