import OrderConfirmRiskPopups from "../../c2cProject/OrderConfirmRiskPopups";

const router = {}

/*------------------------------------------交易所开始-----------------------------------------*/

import Home from '../../components/HomePage'
import TestNav1 from '../../components/TestNavPage'
import Login from '../../components/SignLogin'
import Register from '../../components/Register'
import Verify from '../../components/SignVerification'

import ForgetPsw from '../../components/SignForgetPsw'
import SignResetPsw from '../../components/SignResetPsw'
import SignResetPswVerify from '../../components/SignResetPswVerify'
import Mine from '../../components/MinePage'
import Setting from '../../components/SettingPage'
import ModifyLoginPsw from '../../components/SettingPageModifyLoginPsw'

import AssetDetail from '../../components/AssetPageDetail'
import Recharge from '../../components/AssetRecharge'
import RechargeAndWithdrawalsRecords from '../../components/AssetRecords'
import RechargeAndWithdrawalsRecordsDetail from '../../components/AssetRecordsDetail'
import InternalTransferRecordsDetail from '../../components/InternalTransferRecordsDetail'
import CapitalTransferRecordsDetail from '../../components/CapitalTransferRecordsDetail'
import MiningRecordsDetail from '../../components/MiningRecordsDetail'
import FundRecordsDetail from '../../components/FundRecordsDetail'
import HeatRecordsDetail from '../../components/HeatRecordsDetail'
import CashBackRecordsDetail from '../../components/CashBackRecordsDetail'
import WebPage from '../../components/WebPage'
import MyRecommend from '../../components/MineMyRecommend'
import Demo from '../../components/Demo'
import TraddingHall from '../../components/TraddingHall'

import Withdrawals from '../../components/AssetWithdrawals'
import WithdrawalsEmailVerify from '../../components/AssetWithdrawalsEmailVerify'
import WithdrawalsCodeVerify from '../../components/AssetWithdrawalsCodeVerify'
import MarketList from '../../components/MarketList'
import HistoryOrder from '../../components/HistoryOrder'
import UserAgreement from '../../components/UserAgreement'

import HistoryOrderDetail from '../../components/HistoryOrderDetail'

import AboutUs from '../../components/AboutUs'
import Deal from '../../components/Deal'
import BindGoogle from '../../components/MineBindGoogle'
import BindGoogleStepTwo from '../../components/MineBindGoogleStepTwo'
import BindMobile from '../../components/MineBindMobile'
import ReleaseGoogle from '../../components/MineReleaseGoogle'
import ReleaseMobile from '../../components/MineReleaseMobile'
import Poster from '../../components/Poster'
import AdditionalRewards from '../../components/AdditionalRewards'
import BindEmail from '../../components/MineBindEmail'
import ReleaseEmail from '../../components/MineReleaseEmail'
import WorkOrder from '../../components/WorkOrder'
import IDCardA from '../../components/IDCardA';
import IDCardB from '../../components/IDCardB';
import ShootingInstructions from '../../components/ShootingInstructions';
import VideoRecordingInstructions from "../../components/VideoRecordingInstructions";
import VideoCertification from '../../components/VideoCertification';
import CertificationNumber from '../../components/CertificationNumber';
import CertificationResult from '../../components/CertificationResult';
import LiteFace from '../../components/LiteFace';
import GestureUnlock from '../../components/GestureUnlock'
import GesturePasswordSet from '../../components/GesturePasswordSet'
import GesturePasswordLogin from '../../components/GesturePasswordLogin'
import AssetPageSearch from "../../components/AssetPageSearch";
import SecurityCenter from "../../components/SecurityCenter";
import RealNameCertification from "../../components/RealNameCertification";
import RegisterArea from "../../components/RegisterArea";
import MarketSearch from "../../components/MarketSearch";

import AddBankCard from "../../c2cProject/AddBankCard"

//otc
import OtcIndex from "../../otcProject/pages/OtcIndex";
import OtcOrderList from "../../otcProject/pages/OtcOrderList";
import OtcOrderDetail from "../../otcProject/pages/OtcOrderDetail";

// 主页
router.Home = {
    screen: Home
}
router.TestNav = {
    screen: TestNav1
}
// 登录
router.Login = {
    screen: Login
}
// 注册
router.Register = {
    screen: Register
}
// 登录二次验证
router.Verify = {
    screen: Verify
}
// 忘记密码
router.ForgetPsw = {
    screen: ForgetPsw
}
// 登录找回密码后重置密码
router.SignResetPsw = {
    screen: SignResetPsw
}

// 登录找回密码两页
router.SignResetPswVerify = {
    screen: SignResetPswVerify
}

// 我的
router.Mine = {
    screen: Mine
}
// 安全中心
router.SecurityCenter = {
    screen: SecurityCenter
}

// 设置
router.Setting = {
    screen: Setting
}

// 设置页修改密码
router.ModifyLoginPsw = {
    screen: ModifyLoginPsw
}

// 资产详情页
router.AssetDetail = {
    screen: AssetDetail,
    animationType: 'forVertical'
}

// 资产页
router.AssetPageSearch = {
    screen: AssetPageSearch,
}
// 交易大厅
router.Deal = {
    screen: Deal
}
//交易大厅新
router.DealPage = {
    screen: DealPage
}

// 充值页
router.Recharge = {
    screen: Recharge
}

// 充值提现历史记录
router.RechargeAndWithdrawalsRecords = {
    screen: RechargeAndWithdrawalsRecords
}

// 充值提现记录详情页
router.RechargeAndWithdrawalsRecordsDetail = {
    screen: RechargeAndWithdrawalsRecordsDetail
}

// 内部转账记录详情页
router.InternalTransferRecordsDetail = {
    screen: InternalTransferRecordsDetail
}
// 钱包法币划转记录详情页
router.CapitalTransferRecordsDetail = {
    screen: CapitalTransferRecordsDetail
}

// 基金财务记录详情页
router.FundRecordsDetail = {
    screen: FundRecordsDetail
}

// 财务记录热度记录详情页
router.CashBackRecordsDetail = {
    screen: CashBackRecordsDetail
}

// 返现记录详情页
router.HeatRecordsDetail = {
    screen: HeatRecordsDetail
}

// 挖矿记录详情页
router.MiningRecordsDetail = {
    screen: MiningRecordsDetail
}

// 网页
router.WebPage = {
    screen: WebPage
}

// 客服网页
router.CustomerServiceWebPage = {
    screen: CustomerServiceWebPage
}

// 我的推荐
router.MyRecommend = {
    screen: MyRecommend
}

// 提现页
router.Withdrawals = {
    screen: Withdrawals
}

// 提现邮箱确认
router.WithdrawalsEmailVerify = {
    screen: WithdrawalsEmailVerify
}

// 提现谷歌或手机验证码确认
router.WithdrawalsCodeVerify = {
    screen: WithdrawalsCodeVerify
}


router.Demo = {
    screen: Demo
}

router.TraddingHall = {
    screen: TraddingHall
}

router.MarketList = {
    screen: MarketList
}

router.HistoryOrder = {
    screen: HistoryOrder
}

// 关于我们
router.AboutUs = {
    screen: AboutUs
}

router.HistoryOrderDetail = {
    screen: HistoryOrderDetail
}

// 用户协议
router.UserAgreement = {
    screen: UserAgreement
}

// 绑定邮箱页面
router.BindEmail = {
    screen: BindEmail
}

// 解绑邮箱页面
router.ReleaseEmail = {
    screen: ReleaseEmail
}

// 绑定谷歌页面
router.BindGoogle = {
    screen: BindGoogle
}

// 绑定谷歌页面第二页
router.BindGoogleStepTwo = {
    screen: BindGoogleStepTwo
}

// 解绑谷歌
router.ReleaseGoogle = {
    screen: ReleaseGoogle
}
// 绑定手机
router.BindMobile = {
    screen: BindMobile
}

// 解绑手机
router.ReleaseMobile = {
    screen: ReleaseMobile
}

// 使用BDB燃烧额外奖励
router.AdditionalRewards = {
    screen: AdditionalRewards
}

// 我的海报
router.Poster = {
    screen: Poster
}

// 提交工单
router.WorkOrder = {
    screen: WorkOrder
}

// 手势解锁
router.GestureUnlock = {
    screen: GestureUnlock
}

//设置手势密码
router.GesturePasswordSet = {
    screen: GesturePasswordSet
}

//手势密码登录
router.GesturePasswordLogin = {
    screen: GesturePasswordLogin
}
// 实名认证人工认证
router.RealNameCertification = {
    screen: RealNameCertification
}
// 实名认证人工认证2
router.RealNameCertificationStep2 = {
    screen: RealNameCertificationStep2
}
// 实名认证身份证正面
router.IDCardA = {
    screen: IDCardA
}

// 实名认证身份证反面
router.IDCardB = {
    screen: IDCardB
}

// 拍摄须知
router.ShootingInstructions = {
    screen: ShootingInstructions
}

// 视频录制须知
router.VideoRecordingInstructions = {
    screen: VideoRecordingInstructions
}

// 视频认证
router.VideoCertification = {
    screen: VideoCertification
}

// 视频认证数字
router.CertificationNumber = {
    screen: CertificationNumber
}

// 认证结果 成功和失败
router.CertificationResult = {
    screen: CertificationResult
}

// Lite方案
router.LiteFace = {
    screen: LiteFace
}

// Lite方案
router.GestureProgressBar = {
    screen: GestureProgressBar
}
router.RegisterArea = {
    screen: RegisterArea
}

//行情搜索页面
router.MarketSearch = {
    screen: MarketSearch
}

//编辑自选区页面
router.MarketCollectEdit = {
    screen: MarketCollectEdit
}



/*------------------------------------------交易所结束-----------------------------------------*/


/*-------------------------------------------C2C开始------------------------------------------*/

import C2CHomePage from '../../c2cProject/C2CHomePage'
import TransactionBuy from '../../c2cProject/TransactionBuy'
import TransactionSell from '../../c2cProject/TransactionSell'
import OrderList from '../../c2cProject/OrderList'
import OrderDetail from '../../c2cProject/OrderDetail'
import OrderConfirmPopups from '../../c2cProject/OrderConfirmPopups'
import BindBank from '../../c2cProject/BindBank'
import PaymentSet from '../../c2cProject/PaymentSet'
import VerifyPopups from '../../c2cProject/VerifyPopups'
import GestureProgressBar from "../../components/GestureProgressBar";
import CustomerServiceWebPage from "../../components/CustomerServiceWebPage";
import DealPage from "../../components/DealPage";
import RealNameCertificationStep2 from "../../components/RealNameCertificationStep2";
import MarketCollectEdit from "../../components/MarketCollectEdit";

// c2c主页
router.C2CHomePage = {
    screen: C2CHomePage
}
// 用户买入
router.TransactionBuy = {
    screen: TransactionBuy
}
// 用户卖出
router.TransactionSell = {
    screen: TransactionSell
}
// 订单列表
router.OrderList = {
    screen: OrderList
}
// 订单详情
router.OrderDetail = {
    screen: OrderDetail
}
// 订单弹窗
router.OrderConfirmPopups = {
    screen: OrderConfirmPopups
}
// 验证弹窗
router.VerifyPopups = {
    screen: VerifyPopups
}
// 交易风险弹窗
router.OrderConfirmRiskPopups = {
    screen: OrderConfirmRiskPopups
}
// 绑定银行卡
router.BindBank = {
    screen: BindBank
}
// 支付方式设置
router.PaymentSet = {
    screen: PaymentSet
}
// 添加银行卡
router.AddBankCard = {
    screen: AddBankCard
}


//otc
router.OtcIndex = {
	screen: OtcIndex
}
//otc list
router.OtcOrderList = {
	screen: OtcOrderList
}
//otc detail
router.OtcOrderDetail = {
	screen: OtcOrderDetail
}


export default router