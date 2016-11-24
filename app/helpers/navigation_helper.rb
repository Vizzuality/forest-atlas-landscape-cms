module NavigationHelper
  # Checks if the navigation buttons should be enabled, according to the current step
  # Params:
  # +steps+:: A list with all the existing steps
  # +step_to_validate+:: The current step being validated
  # +step+:: The current step the user is at
  # +id+:: The id of the object being created/edited. Used to know if the user is editing or creating
  # +invalid_steps+:: a List of steps that will always be disabled
  # +invalid_state+:: A boolean saying if the user is in an invalid state (therefore making all steps disabled)
  def disable_button? (steps, step_to_validate, step, id = false, invalid_steps, invalid_state)
    # If the state is invalid, all the buttons are disabled
    if invalid_state
      return true
    end
    # If the current step is on the list of invalid steps
    return true if invalid_steps && invalid_steps.include?(step_to_validate)
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
