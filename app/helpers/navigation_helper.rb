module NavigationHelper
  # Checks if the navigation buttons should be enabled, according to the current step
  def disable_button? (steps, step_to_validate, step, id)
    # When is editing
    if id
      return step_to_validate == 'finish'
    else
      return steps.find_index(step) < steps.find_index(step_to_validate)
    end
  end

  # Checks if the navigation buttons should be active, according to the current step
  def active_button? (steps, step_to_validate, step, id)
    # When is editing
    if id
      return step == step_to_validate
    else
      return steps.find_index(step) === steps.find_index(step_to_validate)
    end
  end
end
