package com.http;

import android.annotation.TargetApi;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.text.TextUtils;
import android.util.Log;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.StreamCorruptedException;
import java.util.HashSet;
import java.util.Set;

import static android.content.Context.MODE_PRIVATE;

/**
 * 保存配置信息工具类
 */
public class SavePreferences {
    private static final String PREFERENCE_FILE = "share_preference_file";
    private static final String TAG = "SavePreferences";
    private static boolean sIsAtLeastGB;//判断不同sdk版本，SharedPreferences.Editor的使用方式

    static {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.GINGERBREAD) {
            sIsAtLeastGB = true;
        }
    }

    @TargetApi(Build.VERSION_CODES.GINGERBREAD)
    public static void apply(SharedPreferences.Editor editor) {
        if (sIsAtLeastGB) {
            editor.apply();
        } else {
            editor.commit();
        }
    }

    /**
     * 加入到偏好设置
     *
     * @param context
     * @param name    存储键
     * @param data    存储值
     */
    public static void setData(Context context, String name, Object data) {
        try {
            SharedPreferences sp = context.getSharedPreferences(PREFERENCE_FILE, MODE_PRIVATE);
            SharedPreferences.Editor editor = sp.edit();
            if (data == null) {
                editor.putString(name, null);
            }
            if (data instanceof String) {
                editor.putString(name, data.toString());
            } else if (data instanceof Integer) {
                editor.putInt(name, Integer.valueOf(data.toString()));
            } else if (data instanceof Long) {
                editor.putLong(name, Long.valueOf(data.toString()));
            } else if (data instanceof Float) {
                editor.putFloat(name, Float.valueOf(data.toString()));
            } else if (data instanceof HashSet || data instanceof Set) {
                editor.putStringSet(name, (Set<String>) data);
            } else if (data instanceof Boolean) {
                editor.putBoolean(name, Boolean.valueOf(data.toString()));
            } else {
                setObject(context, name, data);
            }
            apply(editor);
        } catch (Exception ex) {
            Log.e(TAG, "error:setData----:" + name);
        }
    }

    /**
     * 获取String类型
     *
     * @param c
     * @param name 存储键
     * @return String
     */
    public static String getString(Context c, String name) {
        try {
            SharedPreferences sp = c.getSharedPreferences(PREFERENCE_FILE, MODE_PRIVATE);
            return sp.getString(name, "");
        } catch (Exception ex) {
            Log.e(TAG, "error:getString----:" + name);
        }
        return null;
    }

    /**
     * 获取Int数据
     *
     * @param c
     * @param name 存储键
     * @return int
     */
    public static int getInt(Context c, String name) {
        try {
            SharedPreferences sp = c.getSharedPreferences(PREFERENCE_FILE, MODE_PRIVATE);
            return sp.getInt(name, 0);
        } catch (Exception ex) {
            Log.e(TAG, "error:getInt----:" + name);
        }
        return 0;
    }

    /**
     * 获取boolean 类型的数据
     *
     * @param c
     * @param name 存储键
     * @return Boolean
     */
    public static Boolean getBoolean(Context c, String name) {
        try {
            SharedPreferences sp = c.getSharedPreferences(PREFERENCE_FILE, MODE_PRIVATE);
            return sp.getBoolean(name, false);
        } catch (Exception ex) {
            Log.e(TAG, "error:getBoolean----:" + name);
        }
        return null;
    }

    /**
     * 获取boolean 类型的数据
     *
     * @param c
     * @param name 存储键
     * @return Boolean
     */
    public static Boolean getBoolean(Context c, String name, boolean def) {
        try {
            SharedPreferences sp = c.getSharedPreferences(PREFERENCE_FILE, MODE_PRIVATE);
            return sp.getBoolean(name, def);
        } catch (Exception ex) {
            Log.e(TAG, "error:getBoolean----:" + name);
        }
        return null;
    }

    /**
     * 获取Long类型的数据
     *
     * @param c
     * @param name 存储键
     * @return long
     */
    public static Long getLong(Context c, String name) {
        try {
            SharedPreferences sp = c.getSharedPreferences(PREFERENCE_FILE, MODE_PRIVATE);
            return sp.getLong(name, 0L);
        } catch (Exception ex) {
            Log.e(TAG, "error:getLong----:" + name);
        }
        return null;
    }

    /**
     * 获取浮点类型
     *
     * @param c
     * @param name 存储键
     * @return float
     */
    public static Float getFloat(Context c, String name) {
        try {
            SharedPreferences sp = c.getSharedPreferences(PREFERENCE_FILE, MODE_PRIVATE);
            return sp.getFloat(name, 0.00f);
        } catch (Exception ex) {
            Log.e(TAG, "error:getFloat----:" + name);
        }
        return null;
    }

    /**
     * 获取Set<String>对象
     *
     * @param c
     * @param name 存储键
     * @return Set
     */
    public static Set getStringSet(Context c, String name) {
        try {
            SharedPreferences sp = c.getSharedPreferences(PREFERENCE_FILE, MODE_PRIVATE);
            return sp.getStringSet(name, null);
        } catch (Exception ex) {
            Log.e(TAG, "error:getStringSet----:" + name);
        }
        return null;
    }

    /**
     * 根据对象类型获取存储对象
     *
     * @param context
     * @param name    存储键
     * @param co      对象类型 如String.class
     * @return object
     */
    public static Object getData(Context context, String name, Class<?> co) {
        Object data = null;
        try {
            SharedPreferences sp = context.getSharedPreferences(PREFERENCE_FILE, MODE_PRIVATE);
            if (co == String.class) {
                data = getString(context, name);
            } else if (co == Integer.class) {
                data = getInt(context, name);
            } else if (co == Long.class) {
                data = getLong(context, name);
            } else if (co == Float.class) {
                data = getFloat(context, name);
            } else if (co == Set.class) {
                data = getStringSet(context, name);
            } else if (co == Boolean.class) {
                data = getBoolean(context, name);
            } else {
                data = getObject(context, name);
            }

        } catch (Exception ex) {
            Log.e(TAG, "error:getData----:" + name);
        }
        return data;
    }


    /**
     * 保存object 对象到偏好设置
     *
     * @param context
     * @param key     名称
     * @param obj     存储的对象
     */
    public static void setObject(Context context, String key, Object obj) {
        try {
            SharedPreferences.Editor data = context.getSharedPreferences(PREFERENCE_FILE, MODE_PRIVATE).edit();
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            ObjectOutputStream os = new ObjectOutputStream(bos);
            os.writeObject(obj);
            String byteToHex = bytesToHexString(bos.toByteArray());
            data.putString(key, byteToHex);
            apply(data);
        } catch (IOException e) {
            Log.e(TAG, "error:setObject----:" + key);
        }


    }

    /**
     * remove某个sp
     *
     * @param context
     * @param key
     */
    public static void removeSharedPreference(Context context, String key) {
        SharedPreferences sp = context.getSharedPreferences(PREFERENCE_FILE, MODE_PRIVATE);
        SharedPreferences.Editor editor = sp.edit();
        editor.remove(key);
        apply(editor);
    }

    /**
     * 从偏好设置中获取object对象
     *
     * @param context
     * @param key     存储的名称
     * @return
     */
    public static Object getObject(Context context, String key) {
        try {
            SharedPreferences data = context.getSharedPreferences(PREFERENCE_FILE, Context.MODE_PRIVATE);
            if (data.contains(key)) {
                String value = data.getString(key, "");
                if (TextUtils.isEmpty(value)) {
                    return null;
                } else {
                    byte[] hexToByte = stringToBytes(value);
                    ByteArrayInputStream bis = new ByteArrayInputStream(hexToByte);
                    ObjectInputStream ois = new ObjectInputStream(bis);
                    Object obj = ois.readObject();
                    return obj;
                }
            }
        } catch (StreamCorruptedException e) {
            Log.e(TAG, "error:getObject----:" + key);
            //e.printStackTrace();
        } catch (IOException e) {
            Log.e(TAG, "error:getObject----:" + key);
            //e.printStackTrace();
        } catch (ClassNotFoundException e) {
            Log.e(TAG, "error:getObject----:" + key);
            //e.printStackTrace();
        }

        return null;
    }


    /**
     * desc:将数组转为16进制
     *
     * @param bArray
     * @return String
     */
    public static String bytesToHexString(byte[] bArray) {
        if (bArray == null) {
            return null;
        }
        if (bArray.length == 0) {
            return "";
        }
        StringBuffer sb = new StringBuffer(bArray.length);
        String sTemp;
        for (int i = 0; i < bArray.length; i++) {
            sTemp = Integer.toHexString(0xFF & bArray[i]);
            if (sTemp.length() < 2)
                sb.append(0);
            sb.append(sTemp.toUpperCase());
        }
        return sb.toString();
    }


    /**
     * desc:将16进制的数据转为数组
     *
     * @param data
     * @return
     */
    public static byte[] stringToBytes(String data) {
        String hexString = data.toUpperCase().trim();
        if (hexString.length() % 2 != 0) {
            return null;
        }
        byte[] retData = new byte[hexString.length() / 2];
        for (int i = 0; i < hexString.length(); i++) {
            int int_ch;  // 两位16进制数转化后的10进制数
            char hex_char1 = hexString.charAt(i); //两位16进制数中的第一位(高位*16)
            int int_ch1;
            if (hex_char1 >= '0' && hex_char1 <= '9')
                int_ch1 = (hex_char1 - 48) * 16;   //0 的Ascll - 48
            else if (hex_char1 >= 'A' && hex_char1 <= 'F')
                int_ch1 = (hex_char1 - 55) * 16; // A 的Ascll - 65
            else
                return null;
            i++;
            char hex_char2 = hexString.charAt(i); //两位16进制数中的第二位(低位)
            int int_ch2;
            if (hex_char2 >= '0' && hex_char2 <= '9')
                int_ch2 = (hex_char2 - 48); // 0 的Ascll - 48
            else if (hex_char2 >= 'A' && hex_char2 <= 'F')
                int_ch2 = hex_char2 - 55; // A 的Ascll - 65
            else
                return null;
            int_ch = int_ch1 + int_ch2;
            retData[i / 2] = (byte) int_ch;//将转化后的数放入Byte里
        }
        return retData;
    }
}
