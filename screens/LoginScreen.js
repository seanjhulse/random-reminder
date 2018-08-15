import React from 'react';
import {
  AsyncStorage,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';

import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  _storeAuthToken = async () => {
    try {
      console.log(this.state.auth_token);
      await AsyncStorage.setItem('auth_token', this.state.auth_token);
      // Move us out of the Login screen once we've been validated
      await this.props.navigation.navigate('Main');
    } catch (error) {
      // Error saving data
    }
  }

  login(email, password) {
    fetch('http://random-reminder-api.herokuapp.com/authenticate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          email: email, 
          password: password
        }
      )
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.auth_token) {
        console.log('Successful login!');
        this.setState({
          auth_token: responseJson.auth_token,
        }, function(){
          // this is where you redirect
          this._storeAuthToken();
        });
      }
    })
    .catch((error) =>{
      console.error(error);
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      email: 'seanjhulse@gmail.com',
      password: '',
      auth_token: '',
    };

    this.login.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

          <View style={styles.getStartedContainer}>
            <Text>Login</Text>
            <TextInput
              style={{height: 40, width: 200, padding: 10}}
              placeholder="Email"
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
            />
            <TextInput
              style={{height: 40, width: 200, padding: 10}}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
            />
          </View>
          <View style={styles.getStartedContainer}>
            <Button
              onPress={() => this.login(this.state.email, this.state.password)}
              title="Submit"
              color="#232323"
            />
          </View>

        </ScrollView>

      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
