/**
 * auth.middleware.js
 * Middleware для проверки авторизации и ролей пользователей
 */

/**
 * Проверяет, что пользователь авторизован.
 * Если нет — перенаправляет на /login
 */
exports.requireLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.currentUser = req.session.user;
    return next();
  }
  res.redirect("/login");
};

/**
 * Проверяет, что пользователь имеет одну из указанных ролей.
 * @param {string[]} roles — массив допустимых ролей, например ['admin', 'manager']
 */
exports.requireRole = (roles) => {
  return (req, res, next) => {
    if (req.session && req.session.user && roles.includes(req.session.user.role)) {
      return next();
    }
    res.status(403).render("error", {
      title: "Доступ запрещён",
      message: "У вас недостаточно прав для просмотра этой страницы.",
      activePage: "error"
    });
  };
};

/**
 * Передаёт данные текущего пользователя во все шаблоны EJS.
 * Подключается глобально в server.js
 */
exports.injectUser = (req, res, next) => {
  res.locals.currentUser = req.session ? req.session.user : null;
  next();
};
