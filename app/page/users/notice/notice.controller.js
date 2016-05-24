/**
 * Created by xiangsongtao on 16/3/16.
 * 系统消息 controller
 */
(function () {
  angular.module('smartac.page')
      .controller('noticeCtrl', ['$scope','$ionicPopup',function ($scope,$ionicPopup) {

        $scope.data = {
          showDelete: false
        };

        $scope.delete = function(item) {
          $scope.items.splice($scope.items.indexOf(item), 1);
        };

        $scope.showNoticeInfo = function(item) {
          var alertPopup = $ionicPopup.show({
            title: item.title, // String. The title of the popup.
            cssClass: 'noticePopup', // String, The custom CSS class name
            subTitle: '', // String (optional). The sub-title of the popup.
            template: item.content, // String (optional). The html template to place in the popup body.
            //templateUrl: '', // String (optional). The URL of an html template to place in the popup   body.
            //scope: $scope, // Scope (optional). A scope to link to the popup content.
            buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
              text: '确定',
              type: 'noticePopupBtn',
              onTap: function(e) {
                // e.preventDefault() will stop the popup from closing when tapped.
                //e.preventDefault();
              }
            }]
          });
          //alertPopup.then(function(res) {
          //  console.log('Thank you for not eating my delicious ice cream cone');
          //});
        };

        $scope.items = [
          {
            id: 0,
            title:"会员卡消息",
            content:"恭喜您!您的会员卡等级已提升至VIP!0",
            time:"2016年3月12日"
          },
          {
            id: 1,
            title:"系统消息",
            content:"vivoCity将在一周后进行升级,请及时下载更新!",
            time:"2016年3月18日"
          }
          ,
          {
            id: 2,
            title:"临时消息",
            content:"您的账号异地登陆,希望您注意您的账号安全!",
            time:"2016年3月19日"
          }
          ,
          {
            id: 3,
            title:"积分消息",
            content:"黄记煌积分满300送300,从2016年3月30日起,截止到4月30日,先到先得!机不可失失不再来啊,亲们,要记住日期哈,一般我家的优惠券是不会这么放血的,现在老板都看不下去了加我撤消息,不过我还是偷偷的放出来了,亲么,我容易吗?不都是为了亲们能吃到实惠的黄记煌吗!呜呜呜呜呜....",
            time:"2016年3月26日"
          }
        ];




      }]);

})();