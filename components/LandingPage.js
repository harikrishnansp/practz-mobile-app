/* @flow */
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import React, { Component } from 'react';
import styles from './Assets/Style';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
  Alert,
  BackHandler,
  Button,
  StyleSheet,
  AsyncStorage,
} from 'react-native';
import URL from './Url';

export class LandingPage extends Component {
  constructor(){
    super();
    this.state = {isMounted: false}
    // const { navigate } = this.props.navigation;
    classthis=this;
  this.state={
    HOME:URL.HOME,
    AVAILABLE_EXAM:URL.AVAILABLE_EXAM,
    ONGOING_EXAM:URL.ONGOING_EXAM,
    PRODUCT:URL.PRODUCT,
    status:'',
    view:'',
    eid:0,
    eprod:'',
    qname:'',
    exp:'',
    checkFlag:0,
    checkFlagProgress:0,
    productData: [
      "name":" ",
      "attributes":"",
      "questionPaperName":"",
      "amountWithCurrencySymbol":"",

          ],
    progressData: [
      "id":" ",
      "percentageCompleted":0,
      "questionPaperName":"",

          ],
    availableExamList:[
      {
          "questionPaperName": "",
          "examProductName": "",
          "expiryDate": "",
          attributes:{
            questionPaperName:""
          }
      }
  ]
  }
  }

    componentWillMount() {
      console.log("inside landing will mount");
      AsyncStorage.multiGet(['userId']).then((data) => {
      fetch(this.state.HOME+this.state.AVAILABLE_EXAM+'userId='+data[0][1]+'')
      .then(response =>  response.json())
      .then(responseobj => {
      //   if(responseobj==401){
      //   logout();
      //   this.props.navigation.navigate('Loign');
      // }else{
      //     this.setState({
      //     attempted:responseobj.data,
      //   });
      // }
      if((responseobj.data)=== undefined ||(responseobj.data.length<1)){
        this.setState({
          status:'No active exams available now. Please check later.',
          checkFlag:1,
          view:'',
          availableExamList:[
            {
                "questionPaperName": "",
                "examProductName": "",
                "expiryDate": "",
                "attributes": {
                "questionPaperName": "",
                "examPublisherName": "",
                "qpSections": [],
                "republishStatus": ''
           },
            }
        ],
        eid:0,
        eprod:'',
        qname:'',
        exp:'',
        });
      }else{
        this.setState({
          checkFlag:2,
          status:'Available exams',
          view:'View all',
          availableExamList:responseobj.data,
        });
      }
      });


  });
  //for progressing exams

    console.log("inside progressing exam");
    AsyncStorage.multiGet(['userId','organizationId']).then((data) => {
    fetch(this.state.HOME+this.state.ONGOING_EXAM+'userId='+data[0][1]+'&orgId='+data[1][1]+'')
    .then(response =>  response.json())
    .then(p_responseobj => {
    //   if(responseobj==401){
    //   logout();
    //   this.props.navigation.navigate('Loign');
    // }else{
    //     this.setState({
    //     attempted:responseobj.data,
    //   });
    // }

    if((p_responseobj.data)=== undefined ||(p_responseobj.data.length<1)){
      this.setState({
        status:'No active exams available now. Please check later.',
        checkFlagProgress:1,
        view:'',
        progressData: [
        {
            "percentageCompleted": 0,
            "id":"",
            "questionPaperName": "",
        }
    ],
      eid:0,
      eprod:'',
      qname:'',
      exp:'',
      });
      console.log("No ongoing exam: ",this.state.HOME+this.state.ONGOING_EXAM+'userId='+data[0][1]+'&orgId='+data[1][1]+'');
    }else{
      console.log("progress response:",p_responseobj.data);
      this.setState({
        checkFlagProgress:2,
        progressData:p_responseobj.data,
      });
    }
    });
//buy product
fetch(this.state.HOME+this.state.PRODUCT+'GwTemplateId=catalog&userId='+data[0][1]+'&organizationId='+data[1][1]+'')
.then(response =>  response.json())
.then(responseProduct => {
    this.setState({
    productData:responseProduct,
    })
console.log("product buy :",responseProduct);
  })
  //buy product ends


});
}
componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
}



handleBackButton() {
    return BackHandler.exitApp();
}
  render() {
    const barWidth = Dimensions.get('screen').width - 30;
      const progressCustomStyles = {
        backgroundColor: 'red',
        borderRadius: 0,
        borderColor: 'orange',
      };
    {
    this.state.checkFlag==1||this.state.checkFlag==0
    ? examList = this.state.availableExamList.map((exam, index) => {
     return(<View key={index.toString()+"checkflag"} ></View>);
   })
    :
    examList = this.state.availableExamList.map((exam, index) => {
     return(
       <View key={index.toString()} >
         <TouchableOpacity style={[styles.announcementBox, styles.flexrow]}
           onPress={() => this.props.navigation.navigate('ExamDetails',{eid:exam.id,eprod:exam.examProductName,qname:exam.attributes.questionPaperName})} >
           <View style={[styles.flexcol, styles.innerTextBox]} >
             <Text style={[styles.topTitle]}>{exam.attributes.questionPaperName}</Text>
             <Text style={[styles.lightFont]} >{exam.examProductName}</Text>
             <View style={[styles.flexrow]}>
               <Text style={[styles.totalWidth]}>Ends on {exam.expiryDate}</Text>
             </View>
           </View>
           <View style={[styles.sideBotton, styles.brightBlue]} >
             <Text style={[styles.bookFont,styles.whiteFont]} >Science & Tech </Text>
           </View>
         </TouchableOpacity>
       </View>
     );
   });


    this.state.checkFlagProgress==1||this.state.checkFlagProgress==0
    ? progressList = this.state.progressData.map((exam, index) => {
     return(<View key={index.toString()} ></View>);
   })
    :
    progressList = this.state.progressData.map((exam, index) => {
     return(
       <View style={[styles.announcementBox, styles.flexrow]} key={index.toString()} >

         <TouchableOpacity onPress={() => this.props.navigation.navigate('ExamDetails',{eid:exam.id,eprod:exam.questionPaperName,qname:exam.questionPaperName})} >
         <View>
           <Text style={[styles.bookFont,styles.blackFont,styles.boldFont]} >On progressing exam: {exam.questionPaperName}</Text>
         </View>
           <View >
             <ProgressBarAnimated
             width={barWidth}
             value={exam.percentageCompleted}
             backgroundColorOnComplete="#6CC644"
             backgroundColor="#6CC644"
           />
           </View>
           <View  >
             <Text style={[styles.bookFont,styles.blackFont]} >{exam.percentageCompleted}%</Text>
           </View>
           <View style={[styles.sideBotton, styles.brightBlue]} ><Text style={[styles.bookFont,styles.whiteFont]} >Continue</Text></View>
       </TouchableOpacity>
     </View>
     );
   });
   }
    return (

      <ScrollView>
        <View style={styles.flexrow}>
          <View style={[styles.topBox, styles.blue]}>
            <Text style={{ color: '#ffffff' }}>practice realtime at your convenience!</Text>
            <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Nurse Model Exams</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>	&#8377;</Text>
              <Text style={{ color: '#ffffff', fontWeight: 'bold' }}> 350</Text>

              <Text style={{ color: '#ffffff', marginLeft: 50, }}> 10 Q&A</Text>
            </View>
          </View>
          <View style={[styles.topBox, styles.red]}>
            <Text style={{ color: '#ffffff' }}>practice realtime at your convenience!</Text>
            <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Nurse Model Exams</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>	&#8377;</Text>
              <Text style={{ color: '#ffffff', fontWeight: 'bold' }}> 350</Text>
              <Text style={{ color: '#ffffff', marginLeft: 50, }}> 10 Q&A</Text>
            </View>
          </View>
        </View>

        {progressList}

        <View style={[styles.announcementBox, styles.flexrow]}>
          <View >
            <Image style={{ marginTop: 10 }} source={require('./Assets/images/announcements.png')}
            />
          </View>
          <View style={[styles.flexcol, styles.innerTextBox]} >
            <Text style={[styles.heavyFont,styles.boldFont,styles.blackFont]}>Take a free test</Text>
            <Text style={[styles.lightFont]} >Lorem ipsum dolor sit amet, consectetur adipisci</Text>
            <View style={[styles.flexrow]}>
              <Text style={[styles.endFont]}>TRY NOW</Text>
            </View>
          </View>
        </View>
        <View style={[styles.flexrow, styles.availableBox]}>
          <Text style={{ fontWeight: 'bold', color: '#000', flex: 3 }}>{this.state.status}</Text>
          <Text style={{ color: '#676262', flex: 1, }}>{this.state.view}</Text>
        </View>

        {examList}

      </ScrollView>

    );
  }
}
