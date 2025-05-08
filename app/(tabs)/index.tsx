import React, { useState, useEffect, act } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, Pressable, Image } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Ionicons } from "@expo/vector-icons";
import { IconSymbol } from '@/components/ui/IconSymbol';

interface Post {
  id: string;
  author: string;
  postedAt: string;
  content: string;
  initialLikeCount?: number;
  isLikedByCurrentUser?: boolean;
  imageUrl?: string;
}

const PostItem = ({ post }: { post: Post }) => {
  const [timeAgo, setTimeAgo] = useState('');
  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser || false);
  const [likeCount, setLikeCount] = useState(post.initialLikeCount || 0);

  useEffect(() => {
   
    const updateRelativeTime = () => {
      try {
        const postedDate = new Date(post.postedAt);
        if (!isNaN(postedDate.getTime())) {
          setTimeAgo(formatDistanceToNow(postedDate, { addSuffix: true, locale: ko }));
        } else {
          setTimeAgo('유효하지 않은 시간');
        }
      } catch (error) {
        console.error('Error formatting date:', error);
        setTimeAgo('시간 계산 오류');
      }
      };

      updateRelativeTime();

      const intervalId = setInterval(updateRelativeTime, 60000); // 1분마다 업데이트
      return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 클리어
    }, [post.postedAt]);

    const handleLikePress = () => {
      if (isLiked) {
        setLikeCount(likeCount - 1);
      } else {
        setLikeCount(likeCount + 1);
      }
      setIsLiked(!isLiked);   
    };

    const handleCommentPress = () => {
      console.log('Comment button pressed for post:', post.id);
    };


  return (
    <View style={postStyles.container}>
      <View style={postStyles.header}>
        <Text style={postStyles.author}>{post.author}</Text>
        <Text style={postStyles.time}>{timeAgo}</Text>
      </View>
      <Text style={postStyles.content}>{post.content}</Text>
      
      {post.imageUrl && (
        <Image
          source={{ uri: post.imageUrl }}
          style={postStyles.image}
          resizeMode="cover"
        />
      )}
        
        <View style={postStyles.actionsContainer}>
          <Pressable onPress={handleLikePress} style={postStyles.actionButton}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={24} // Corrected
              color={isLiked ? 'red' : '#555'}
            />
            <Text style={postStyles.likeCountText}>{likeCount}</Text>
          </Pressable>
        <Pressable onPress={handleCommentPress} style={postStyles.actionButton}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24} // Corrected
            color="#555"
          />
          </Pressable>
        </View>
        </View>
  );
};



   const postStyles = StyleSheet.create({
    container: {
      paddingBottom: 10,
      backgroundColor: '#FFF',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#eee',
      marginBottom: 8,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingTop: 15,
    },
    author: {
      fontWeight: 'bold',
      fontSize: 15,
    },
    time: {
      fontSize: 12,
      color: '#888',
    },
    content: {
      fontSize: 14,
      lineHeight: 20,
      paddingHorizontal: 15,
      marginBottom: 10,
    },
    image: {
      width: '100%',
      height: 300,
      marginBottom: 10,
      borderRadius: 10, 
    },
    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5,
    },
    likeCountText: {
      marginLeft: 5,
      fontSize: 14,
      color: '#555',
    }
  });
const TABS = ['ALL', 'Appliances', 'Activities', 'Challenges'];

const samplePosts = [
  {
    id: '1', 
    author: '이승연',
    postedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    content: '아우 입아파 그만말할래 (›´-`‹ )',
    imageUrl: 'https://picsum.photos/seed/1/600/400', // 샘플 이미지 URL
    initialLikeCount: 15,
    isLikedByCurrentUser: false,
   },
   {
    id: '2',
    author: '강혜송',
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    content: '최과장 죽었으면',
     imageUrl: 'https://picsum.photos/seed/2/600/400', // 샘플 이미지 URL
     initialLikeCount: 5,
     isLikedByCurrentUser: true,
  },
  {
    id: '3',
    author: '이정원',
    // 현재 시간보다 1일 전
    postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    content: 'ㅋㅋㅋㅋㅋㅋㅋㅋㅋ',
    // imageUrl: null, // 이미지가 없는 게시물
    initialLikeCount: 0,
    isLikedByCurrentUser: false,
  },
  {
    id: '4',
    author: '박소영',
    // 현재 시간보다 10초 전 (테스트용)
    postedAt: new Date(Date.now() - 10 * 1000).toISOString(),
    content: '잘생긴 사람 조아',
    imageUrl: 'https://picsum.photos/seed/4/600/400', // 샘플 이미지 URL
    initialLikeCount: 100,
    isLikedByCurrentUser: false,
  },
];

export default function HomeScreen() {

  const [selectedTab, setSelectedTab] = useState(TABS[0]);

  const displayedPosts = samplePosts;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainHeader} >
        <Text style={styles.mainHeaderText}>
          Community
        </Text>
      </View>
      <View style={styles.tabContainer}>
        {TABS.map((tabName) => (
          <Pressable
            key={tabName}
            style={styles.tabItem}
            onPress={() => setSelectedTab(tabName)}>
        <Text style={[
  styles.tabText,
  selectedTab === tabName && styles.selectedTabText
        ]}>
          {tabName}
        </Text>
        
        </Pressable>
        ))}
        
      </View>

      <ScrollView style={styles.scrollViewContent} contentContainerStyle={{ paddingBottom: 40 }}>
        {displayedPosts.length > 0 ? (
displayedPosts.map(post => (
  <PostItem key={post.id} post={post} />
))
        ) : (
          <Text>게시물이 없습니다.</Text> 
        )}
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainHeader: {
    height: 56,
    backgroundColor: "#fff",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0', 
  },
  mainHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  tabItem: {
    padding: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    flex: 1,
  },
  tabText:{
    fontSize: 15,
    color: '#a0a0a0',
  },
  selectedTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  scrollViewContent: {
    flex: 1,
  }
});