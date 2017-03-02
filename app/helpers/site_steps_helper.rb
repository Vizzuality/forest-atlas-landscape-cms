module SiteStepsHelper

  def role_matches_step?(role, step)
    role == UserType::MANAGER && step == 'managers' ||
    role == UserType::PUBLISHER && step == 'publishers'
  end

end
