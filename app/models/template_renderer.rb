require 'erb'

class TemplateRenderer
  def self.empty_binding
    binding
  end

  def self.render(template_content, locals = {})
    b = empty_binding
    locals.each { |k, v| b.local_variable_set(k, v) }
    ERB.new(template_content).result(b)
  end
end
