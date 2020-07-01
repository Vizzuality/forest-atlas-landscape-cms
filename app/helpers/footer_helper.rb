module FooterHelper
  def save_button?(object_id, always_save, never_save)
    object_id || (always_save && never_save != true)
  end

  def continue_button_type(object_id, always_save, never_save, publish)
    if save_button?(object_id, always_save, never_save) || publish
      'button'
    else
      'submit'
    end
  end
end
