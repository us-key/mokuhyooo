class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # 通常サインアップ時のuid用、Twitter OAuth認証時のemail用にuuid文字列生成
  def self.create_unique_string
    SecureRandom.uuid
  end
  
end
