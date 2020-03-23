/**
 * hjx 2018.4.16
 */

import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'
import RNComponent from '../configs/classConfigs/ReactNativeComponent'
import baseStyles from '../style/BaseStyle'
import NavHeader from './baseComponent/NavigationHeader'
import Loading from './baseComponent/Loading'
import styles from '../style/UserAgreementStyle'
// import StyleConfigs from '../style/styleConfigs/StyleConfigs'


@observer
export default class App extends RNComponent {


    /*----------------------- data -------------------------*/

    // 加载中
    @observable
    loading = false


    /*----------------------- 生命周期 -------------------------*/

    // 创建，请求可以写在这里
    constructor() {
        super()
    }

    // 挂载
    componentWillMount() {
        super.componentWillMount()
    }

    // 卸载
    componentWillUnmount() {
        super.componentWillUnmount()
    }

    /*----------------------- 函数 -------------------------*/

    // 后退
    @action
    goBack = () => {
        this.$router.goBack()
    }


    /*----------------------- 挂载 -------------------------*/

    render() {
        return (
            <View style={[styles.container]}>
                <NavHeader headerTitle={'用户协议'} goBack={this.goBack}/>

                <ScrollView style={[baseStyles.paddingBox, styles.containerBox]}>
                    <View style={styles.oneLevelArticleBox}>
                        <Text allowFontScaling={false} style={styles.oneLevelArticleText}>
                            This agreement is made by and between you and the operator of EUNEX.  EUNEX is operated by  Digital Asset Exchange Inc.  EUNEX is a global blockchain asset trading platform. EUNEX platform is dedicated to digital asset trading and the provision of related services. EUNEX will respect customer privacy. EUNEX will not sell or lend your personal information to any third party unless your permission is obtained in advance. This platform will use bank-level security and risk management measures to protect each user's personal assets, privacy information, etc.
                        </Text>
                    </View>
                    <View style={styles.oneLevelArticleBox}>
                        <Text allowFontScaling={false} style={styles.oneLevelArticleText}>
                            This Agreement is effective immediately when you click through the registration page of this Website, complete the registration procedures, obtain your account number and password of EUNEX, and shall be binding on you and EUNEX.
                        </Text>
                    </View>

                    <View style={styles.oneLevelArticleBox}>
                        <Text allowFontScaling={false} style={styles.oneLevelArticleText}>
                            These Terms and your use of the Services will be governed by and construed in accordance with the laws of your country, without resort to its conflict of law provisions. You agree that any action at law or in equity pursued by you and arising out of or relating to these Terms not subject to arbitration will be filed only in your country and you hereby irrevocably and unconditionally consent and submit to the exclusive jurisdiction of such courts over any suit, action or proceeding arising out of these Terms.
                        </Text>
                    </View>

                    <View style={styles.oneLevelArticleBox}>
                        <Text allowFontScaling={false} style={styles.oneLevelArticleText}
                        >
                            If you have any objection or any further questions regarding this agreement, please contact us through E-mail: <Text allowFontScaling={false} style={baseStyles.textBlue}>EUNEX@eunex.group</Text>
                        </Text>
                    </View>

                    <View style={styles.titleBox}>
                        <Text allowFontScaling={false} style={styles.titleText}>
                            Registration and Account
                        </Text>
                    </View>


                    <View style={styles.twoLevelArticleBox}>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            You must first confirm and undertake to meet the following eligibility criteria and related regulations when use EUNEX service:
                        </Text>
                    </View>


                    <View style={styles.articleBox}>

                        <Text allowFontScaling={false} style={styles.articleText}>
                            1.You hereby confirm that you are an individual, legal person or other organization with full capacity for civil rights and civil conducts when you complete the registration or use EUNEX service in any other way allowed by EUNEX.
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            2.If you do not have the said capacity, you and your guardian shall undertake all the consequences resulted therefrom, and EUNEX shall have the right to cancel or permanently freeze your account, and claims against you and your guardian for compensation.
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            3.You confirm and promise that you do not register with EUNEX for violating any of the applicable laws or regulations or undermining the order of digital asset transactions on EUNEX. It is prohibited to use EUNEX for any illegal activities. EUNEX reserve the right to hold the relevant persons accountable.
                        </Text>
                    </View>

                    <View style={styles.titleBox}>
                        <Text allowFontScaling={false} style={styles.titleText}>
                            Activation and Modification
                        </Text>
                    </View>

                    <View style={styles.articleBox}>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            During the registration or activation, you shall accurately provide and timely update your information by following the instructions on the relevant page according to the laws and regulations to make it truthful, timely, complete and accurate. If there is any reasonable doubt that any information provided by you is wrong, untruthful, outdated or incomplete, EUNEX shall have the right to send you a notice to make enquiry and demand corrections, remove relevant information directly, and terminate all or part of EUNEX Service to you. EUNEX will not take any responsibility and any loss, direct or indirect, and adverse consequence resulted therefrom will be borne by you. You shall accurately fill in and timely update your email address, telephone number, contact address, postal code and other contact information so that EUNEX or any other user will be able to effectively contact you. You shall be solely and fully responsible for any loss or extra expenses incurred during the use of EUNEX service by you if you cannot be contacted through contact information. You hereby acknowledge and agree that you have the obligation to keep your contact information effective and to take actions as required by EUNEX if there is any change or update.
                        </Text>
                    </View>

                    <View style={styles.titleBox}>
                        <Text allowFontScaling={false} style={styles.titleText}>
                            EUNEX Service
                        </Text>
                    </View>

                    <View style={styles.twoLevelArticleBox}>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            EUNEX only provides online transaction platform services for you to engage in digital asset trading activities through EUNEX (including but not limited to the digital asset transactions etc.). EUNEX does not participate in the transaction of digital assets as a buyer or seller; EUNEX does not provide any services relating to the replenishment and withdrawal of the legal currency of any country.
                        </Text>
                    </View>

                    <View style={styles.twoLevelTitleBox}>
                        <Text allowFontScaling={false} style={styles.twoLevelTitleText}>
                            Content of Service
                        </Text>
                    </View>

                    <View style={styles.articleBox}>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            1.You have the right to browse the real-time quotes and transaction information of digital asset products on EUNEX, to submit digital asset transaction instructions and to complete the digital asset transaction through EUNEX.
                        </Text>

                        <Text allowFontScaling={false} style={styles.articleText}>
                            2.You have the right to view information under the member accounts and to apply the functions provided by EUNEX.
                        </Text>

                        <Text allowFontScaling={false} style={styles.articleText}>
                            3.You have the right to participate in the website activities organized by EUNEX in accordance with the rules of activities posted on EUNEX.
                        </Text>

                        <Text allowFontScaling={false} style={styles.articleText}>
                            4.You have the right to obtain other services that EUNEX promises to offer to you.
                        </Text>
                    </View>

                    <View style={styles.twoLevelTitleBox}>
                        <Text allowFontScaling={false} style={styles.twoLevelTitleText}>
                            Service Rules
                        </Text>
                    </View>

                    <View style={styles.threeLevelTitleBox}>
                        <Text allowFontScaling={false} style={styles.threeLevelTitleText}>
                            You will comply with the following service rules of EUNEX:
                        </Text>
                    </View>

                    <View style={styles.articleBox}>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            1. You shall comply with the provisions of applicable laws, regulations, rules, and policy requirements, and ensure the legality of the source of all digital assets in your account, and shall refrain from engaging in any illegal activities or other activities that damages the rights and interests of EUNEX or any third party, such as sending or receiving information that is illegal, illicit or infringes on the rights and interests of any other person, sending or receiving pyramid scheme information or information or remarks causing other harms, unauthorized use or falsification of the email header information of EUNEX, inter alia.
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            2. You shall comply with applicable laws and regulations and properly use and keep your account with EUNEX and login password, password of your financial transactions, and the mobile phone number bound with your account that you provide upon registration of your account, as well as the security of the verification codes received via your mobile phone. You shall be solely responsible for all your operations carried out using your account with EUNEX and login password, financial transaction password, verification codes sent to your mobile phone, as well as all consequences of such operations. When you find that your account with EUNEX, your login password, financial transaction password, or mobile phone verification codes is used by any unauthorized third party, or uncover any other problem relating to the security of your account, you shall inform EUNEX in a prompt and effective manner, and request EUNEX to suspend the services to your account. EUNEX shall have the right to take actions on your request within a reasonable time; nonetheless, EUNEX does not bear any liability for the consequences that have arisen before such action is taken, including but not limited to any loss that you may sustain. You may not assign your account with EUNEX to any other person by way of donation, lending, leasing, transfer or otherwise without the consent of EUNEX.
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            3. You agree to take responsibility for all activities (including but not limited to information disclosure, information release, online click-approving or submission of various agreements on rules, online renewal of agreements or purchase service) using your account and password with EUNEX.
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            4. In your digital asset transactions on EUNEX, you may not maliciously interfere with the normal proceeding of the digital asset transaction or disrupt the transaction order; you may not use any technical means or other means to interfere with the normal operation of EUNEX or interfere with the other users’ use of the services; you may not maliciously defame the business goodwill of EUNEX on the ground of falsified fact.
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            5. If any dispute arises between you and any other user regarding online transaction, you may not resort to any means other than judicial or governmental means to request EUNEX to provide relevant information.
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            6. All taxes payable as well as all fees relating to hardware, software and services that are incurred by you during the services provided by EUNEX shall be solely borne by you.
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            7. You shall abide by this Agreement and other terms of service and operating rules that EUNEX may release in the future, and you have the right to terminate your use of the services provided by EUNEX at any time.
                        </Text>
                    </View>

                    <View style={styles.twoLevelTitleBox}>
                        <Text allowFontScaling={false} style={styles.twoLevelTitleText}>
                            Product Rules
                        </Text>
                    </View>


                    <View style={styles.threeLevelTitleBox}>
                        <Text allowFontScaling={false} style={styles.threeLevelTitleText}>
                            Rules for crypto to crypto trading products
                        </Text>
                    </View>

                    <View style={styles.threeLevelTitleBox}>
                        <Text allowFontScaling={false} style={styles.threeLevelTitleText}>
                            You undertake that in the process in which you log into EUNEX platform and engage in currency-currency transactions through EUNEX you will properly comply with the following transaction rules.
                        </Text>
                    </View>


                    <View style={styles.articleBox}>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            1.Browsing transaction information
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            When you browse the transaction information on EUNEX platform, you shall read all the content in the transaction information, including but not limited to the price, consignment, handling fee, buying or selling direction, and you shall accept all the contents contained in the transaction information before you proceed with the transaction.
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            2.Submission of Commission
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            After browsing and verifying the transaction information, you may submit your transaction commissions. After you submit the transaction commission, it shall be deemed that you authorize EUNEX to broker you for the corresponding transactions, and EUNEX will automatically complete the matchmaking operation when there is a transaction proposal that meets your price quotation, without prior notice to you.
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            3.Accessing transaction details
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            You can check the corresponding transaction records in the transaction statements by the Management Center, and confirm your own detailed transaction records.
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            4.Revoking/modifying transaction commission.
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            You have the right to revoke or modify your transaction commission at any time before the transaction is concluded.
                        </Text>
                    </View>


                    <View style={styles.titleBox}>
                        <Text allowFontScaling={false} style={styles.titleText}>
                            Termination of this Agreement
                        </Text>
                    </View>

                    <View style={styles.twoLevelArticleBox}>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            1.EUNEX shall have the right to cancel your account with EUNEX in accordance with this Agreement, and this Agreement shall be terminated on the date of the cancellation of your account.
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            2.EUNEX shall have the right to terminate all Service offered by EUNEX to you in accordance with this Agreement, and this Agreement shall terminate on the date of termination of all services offered by EUNEX to you.
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            3.After the termination of this Agreement, you do not have the right to require EUNEX to continue to provide you with any service or perform any other obligation including but not limited to requesting EUNEX to keep or disclose to you any information in your former original account, or to forward to you or any third party any information therein that is not read or sent.
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            4.The termination of this Agreement shall not prevent the observant party from demanding the breaching party to assume other liabilities.
                        </Text>
                    </View>

                    <View style={styles.twoLevelTitleBox}>
                        <Text allowFontScaling={false} style={styles.twoLevelTitleText}>
                            After EUNEX suspends or terminates EUNEX Service to you, your transaction activities prior to such suspension or termination will be dealt with according to the following principles:
                        </Text>
                    </View>


                    <View style={styles.articleBox}>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            1.You will take care of on your own efforts and fully undertake any disputes, losses or extra expenses caused there by and keep EUNEX harmless from any losses or expenses.
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            2.EUNEX shall have the right to delete, at the same time of suspension or termination of services, information related to any un-traded coin tokens that you have uploaded to EUNEX prior to the suspension or termination.
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            3.If you have reached any purchase agreement with any other member prior to the suspension or termination but such agreement has not been performed, EUNEX shall have the right to delete information related to such purchase agreement and the coins in question.
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            4. If you have reached any purchase agreement with any other member prior to the suspension or termination and such agreement has been partially performed, EUNEX may elect not to delete the transaction; provided, however, EUNEX shall have the right to notify your counterparty of the situation at the same time of the suspension or termination.
                        </Text>
                    </View>

                    <View style={styles.titleBox}>
                        <Text allowFontScaling={false} style={styles.titleText}>
                            Risk and Responsibilities
                        </Text>
                    </View>

                    <View style={styles.twoLevelArticleBox}>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            1.Digital assets are neither issued by any finance institution, nor backed by any government. EUNEX does not issue any kinds of digital assets.
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            2.The digital asset market is new and unconfirmed, and will not necessarily expand;
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            3.Digital assets are primarily used by speculators, and are used relatively less on retail and commercial markets; digital asset transactions are highly risky, since they are traded throughout 24-hour a day without limits on the rise or fall in price, and market makers and global government policies may cause major fluctuations in their prices;
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            4.Digital asset transactions may be suspended or prohibited at any time due to the enactment or modification of national laws, regulations and regulatory documents.
                        </Text>
                    </View>


                    <View style={styles.twoLevelArticleBox}>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            Trading of digital assets involves significant risk. You acknowledge and understand that investment in digital assets may result in partial or total loss of your investment and therefore you are advised to decide the amount of your investment based on your loss-bearing capacity. Therefore, you are advised to carefully consider and use clear judgment to assess your financial position and the abovementioned risks before making any decisions on buying and selling digital assets; all losses arising therefrom will be borne by you and we shall not be held liable in any manner whatsoever.
                        </Text>
                    </View>

                    <View style={styles.twoLevelTitleBox}>
                        <Text allowFontScaling={false} style={styles.twoLevelTitleText}>
                            You are hereby informed that:
                        </Text>
                    </View>

                    <View style={styles.twoLevelArticleBox}>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            1.You understand that EUNEX is only intended to serve as a venue for you to obtain digital asset information, find trading counterparties, negotiate on and effect transactions of digital assets. EUNEX does not participate in any of your transactions, and therefore you shall, at your sole discretion, carefully assess the authenticity, legality and validity of relevant digital assets and/or information, and solely bear the responsibilities and losses that may arise therefrom.
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            2.All opinions, information, discussions, analyses, prices, advice and other information on EUNEX are general market reviews and do not constitute any investment advice. We do not bear any loss arising directly or indirectly from reliance on the abovementioned information, including but not limited to, any loss of profits.
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            3.The content of this website may be changed from time to time and at any time without notice, and we have taken reasonable measures to ensure the accuracy of the information on the Website; however, we do not guarantee the degree of such accuracy, or bear any loss arising directly or indirectly from the information on EUNEX or from any delay or failure caused by failure to link up with the internet, transmit or receive any notice and information.
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            4.Using internet-based trading systems also involves risks, including but not limited to failures in software, hardware or Internet links, etc. Since we cannot control the reliability and availability of the Internet, we will not be responsible for any distortion, delay and link failure.
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            5.https://www.2020.exchange/ is the sole official external information release platform for EUNEX;
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            6.No service on eunex.group may be paid for by credit card;
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            7.It is prohibited to use EUNEX for any illegal activities, such as money-laundering, smuggling and commercial bribery. Upon uncovering any of such illegal activities, EUNEX will adopt all available measures, including but not limited to freezing accounts, notifying the relevant authorities and so on, and in this case, we shall not assume any of the responsibilities arising therefrom, and reserve the right to hold the relevant persons accountable.
                        </Text>
                    </View>

                    <View style={styles.titleBox}>
                        <Text allowFontScaling={false} style={styles.titleText}>
                            Limitation and Exemption of Liability
                        </Text>
                    </View>

                    <View style={styles.twoLevelTitleBox}>
                        <Text allowFontScaling={false} style={styles.twoLevelTitleText}>
                            1.You understand and agree that under no circumstance will we be held liable for any of the following events:
                        </Text>
                    </View>


                    <View style={styles.articleBox}>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            1.1 Loss of income;
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            1.2 Loss of transaction profits or contractual losses;
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            1.3 Disruption of the business;
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            1.4 Loss of expected currency losses;
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            1.5 Loss of information;
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            1.6 Loss of opportunity, damage to goodwill or reputation;
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            1.7 Damage or loss of data;
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            1.8 Cost of purchasing alternative products or services;
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            1.9 Any indirect, special or incidental loss or damage arising from any infringement (including negligence), breach of contract or any other cause, regardless of whether such loss or damage may reasonably be foreseen by us, and regardless of whether we are notified in advance of the possibility of such loss or damage.
                        </Text>
                    </View>


                    <View style={styles.twoLevelTitleBox}>
                        <Text allowFontScaling={false} style={styles.twoLevelTitleText}>
                            2.You understand and agree that we shall not be held liable for any damages caused by any of the following events:
                        </Text>
                    </View>


                    <View style={styles.articleBox}>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            2.1 Where we are properly justified in believing that your specific transactions may involve any serious violation or breach of law or agreement;
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            2.2 Where we are properly justified in believing that your conduct on EUNEX is suspected of being illegal or improper;
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            2.3 The expenses and losses arising from the purchase or acquisition of any data, information or transaction, etc. through the services offered by EUNEX;
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            2.4 Your misunderstanding of the Services offered by EUNEX;
                        </Text>
                        <Text allowFontScaling={false} style={styles.articleText}>
                            2.5 Any other losses related to the services provided by EUNEX, which cannot be attributed to us.
                        </Text>
                    </View>


                    <View style={styles.twoLevelTitleBox}>
                        <Text allowFontScaling={false} style={styles.twoLevelTitleText}>
                            3.Where we fail to provide the Services or delay in providing such Services due to information network equipment maintenance, information network connectivity failures, errors in computer, communications or other systems, power failures, weather conditions, unexpected accidents, industrial actions, labor disputes, revolts, uprisings, riots, lack of productivity or production materials, fires, floods, storms, explosions, wars, failure on the part of banks or other partners, collapse of the digital asset market, actions by government, judicial or administrative authorities, other acts that are not within our control or beyond our inability to control, or due to causes on the part of third parties, we shall not assume any responsibility for such failure to provide service or delay in providing services, or for the resultant loss you may sustain as a result of such failure or delay.
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelTitleText}>
                            4.We cannot guarantee that all the information, programs, texts, etc. contained in EUNEX are completely safe, free from the interference and destruction by any malicious programs such as viruses, trojans, etc., therefore, your log-into EUNEX or use of any services offered by EUNEX, download of any program, information and data from EUNEX and your use thereof are your personal decisions and therefore you shall bear the all risks and losses that may possibly arise.
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelTitleText}>
                            5.We do not make any warranties and commitments regarding any of the information, products and business of any third-party websites linked to EUNEX, as well as any other forms of content that do not belong to us; your use any of the services, information, and products provided by a third-party website is your personal decision and therefore you shall assume all the responsibilities arising therefrom.
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelTitleText}>
                            6.We do not make any explicit or implicit warranties regarding your use of the Services offered by EUNEX, including but not limited to the applicability, freedom from error or omission, consistency, accuracy, reliability, and applicability to a specific purpose, of the services provided by EUNEX. Furthermore, we do not make any commitment or guarantee regarding the validity, accuracy, correctness, reliability, quality, stability, integrity and timeliness of the technology and information covered by the services offered by EUNEX. Whether to log in EUNEX or use the services provided by EUNEX is your personal decision and therefore you shall bear all the risks and possible losses arising from such decision. We do not make any explicit or implicit warranties regarding the market, value and price of digital assets; you understand and acknowledge that the digital asset market is unstable, that the price and value of assets may fluctuate or collapse at any time, and that the transaction of digital assets is based on your personal free will and decision and therefore you shall assume all risks and losses that may possible arise therefrom.
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelTitleText}>
                            7.The guarantees and undertakings specified in this Agreement shall be the only guarantee and statements that we make regarding the Services provided by us under this Agreement and through EUNEX, and shall supersede all the warranties and commitments arising in any other way and manner, whether in writing or in words, express or implied. All these guarantees and statements represent only our own commitments and undertakings and do not guarantee any third party's compliance with the guarantees and commitments contained in this Agreement.
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelTitleText}>
                            8.We do not waive any of the rights not mentioned in this Agreement and to the maximum extent permitted by the applicable law, to limit, exempt or offset our liability for damages.
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelTitleText}>
                            9.Upon your registration of your account with EUNEX, it shall be deemed that you approve all operations performed by us in accordance with the rules set forth in this Agreement, and all risks arising from such operations shall be assumed by you.
                        </Text>
                    </View>


                    <View style={styles.titleBox}>
                        <Text allowFontScaling={false} style={styles.titleText}>
                            Applicable Laws
                        </Text>
                    </View>


                    <View style={styles.twoLevelArticleBox}>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            1.These Terms and your use of the Services will be governed by and construed in accordance with the laws of your country, without resort to its conflict of law provisions. It is prohibited to use this EUNEX for any illegal activities, such as money-laundering, smuggling and commercial bribery. Upon uncovering any of such illegal activities, EUNEX will adopt all available measures, including but not limited to freezing accounts, notifying the relevant authorities.
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            2.EUNEX discretionarily undertakes due diligence to prevent money laundering and terrorism financing and will work with local authorities. When using our Services, you acknowledge that your actions are in a legal and proper manner and your sources of digital assets are not from illegal activities. EUNEX will be in coordination with local law enforcement authorities seize， restrict or close-out the account and digital assets, when provided with the corresponding investigation documents.
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            3. If any user of EUNEX violates the law provisions of your country. However, EUNEX has neither motives nor facts to violate the relevant laws of your country. EUNEX is obligated to improve and perfect the compliance of your country law provisions, but does not bear any joint liability for the actions of the user.
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            4.When you choose to use EUNEX service directly or indirectly, you will be deemed to voluntarily accept this statement.
                        </Text>
                        <Text allowFontScaling={false} style={styles.twoLevelArticleText}>
                            5.Any other issues not covered by this statement, the relevant Canadian law provisions shall prevail.
                        </Text>
                    </View>

                    <View style={styles.endArticleBox}>
                        <Text allowFontScaling={false} style={styles.endArticle}>
                            This statement effects immediately after announcement. EUNEX reserve the right to update the contents of this statement and the final interpretation of this agreement.
                        </Text>
                    </View>


                    {/*/!*标题*!/*/}
                    {/*<View style={styles.titleBox}>*/}
                    {/*<Text allowFontScaling={false} style={styles.titleText}>*/}

                    {/*</Text>*/}
                    {/*</View>*/}

                    {/*/!*二级标题*!/*/}
                    {/*<View style={styles.twoLevelTitleBox}>*/}
                    {/*<Text allowFontScaling={false} style={styles.twoLevelTitleText}>*/}

                    {/*</Text>*/}
                    {/*</View>*/}

                    {/*/!*三级标题*!/*/}
                    {/*<View style={styles.threeLevelTitleBox}>*/}
                    {/*<Text allowFontScaling={false} style={styles.threeLevelTitleText}>*/}

                    {/*</Text>*/}
                    {/*</View>*/}


                    {/*/!*一级内容*!/*/}
                    {/*<View style={styles.oneLevelArticleBox}>*/}
                    {/*<Text allowFontScaling={false} style={styles.oneLevelArticleText}>*/}

                    {/*</Text>*/}
                    {/*</View>*/}


                    {/*/!*三级内容*!/*/}
                    {/*<View style={styles.articleBox}>*/}
                    {/*<Text allowFontScaling={false} style={styles.articleText}>*/}

                    {/*</Text>*/}
                    {/*</View>*/}

                    {/*/!*二级内容*!/*/}
                    {/*<View style={styles.twoLevelArticleBox}>*/}
                    {/*<Text allowFontScaling={false} style={styles.twoLevelArticleText}>*/}

                    {/*</Text>*/}
                    {/*</View>*/}


                </ScrollView>


                {/*加载中*/}
                {
                    this.loading && <Loading leaveNav={false}/>
                }
            </View>
        )
    }
}
