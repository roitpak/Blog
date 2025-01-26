import React, {useEffect} from 'react';
import {useTheme} from '../../context/theme/useTheme';
import CustomText from '../common/CustomText';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Theme} from '../../constants/Types';
import categoryService from '../../appwrite/category';
import {Category} from '../../appwrite/types/category';

interface CategoryTabbarProps {
  onCategoryPress: (category: Category) => void | undefined;
  onForYou: () => void | undefined;
  selectedCategory?: Category | null;
}

const CategoryTabbar = ({
  onCategoryPress,
  onForYou,
  selectedCategory,
}: CategoryTabbarProps) => {
  const {theme} = useTheme();
  const [categories, setCategories] = React.useState<Category[]>([]);

  useEffect(() => {
    categoryService
      .getCategories()
      .then(categories => {
        setCategories(categories);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <View style={styles(theme).container}>
      <TouchableOpacity
        onPress={onForYou}
        style={[
          styles(theme).item,
          selectedCategory === null && styles(theme).selectedItem,
        ]}>
        <CustomText type="p2" title="For you" />
      </TouchableOpacity>
      {categories && (
        <FlatList
          contentContainerStyle={styles(theme).flatListContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories.slice(0, 4)}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => onCategoryPress(item)}
              style={[
                styles(theme).item,
                selectedCategory === item && styles(theme).selectedItem,
              ]}>
              <CustomText type="p2" title={item.title} />
            </TouchableOpacity>
          )}
          keyExtractor={({$id}, index) =>
            $id ? $id.toString() : index.toString()
          }
        />
      )}
    </View>
  );
};
const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    item: {
      marginRight: theme.sizes.small,
      alignItems: 'center',
      justifyContent: 'center',
    },
    flatListContainer: {
      paddingVertical: theme.sizes.small,
    },
    selectedItem: {
      borderBottomWidth: 1,
      color: theme.colors.list_border,
    },
  });
export default CategoryTabbar;
